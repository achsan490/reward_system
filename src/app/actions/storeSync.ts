"use server";

import { prisma } from "@/lib/prisma";
import { calculatePoints } from "@/lib/pointCalculator";
import { queryStoreDatabase } from "@/lib/storeDatabase";
import { revalidatePath } from "next/cache";

/**
 * Get point conversion rate from system settings
 */
async function getPointConversionRate(): Promise<number> {
    const setting = await prisma.systemSetting.findUnique({
        where: { key: "point_conversion_rate" },
    });

    if (!setting) {
        return 5000; // Default
    }

    return parseFloat(setting.value);
}

/**
 * Fetch transactions from store database (currently using dummy data)
 * Nanti akan diganti dengan koneksi ke database toko real
 */
export async function fetchStoreTransactions(
    startDate: string,
    endDate: string
) {
    try {
        // Validation
        if (!startDate || !endDate) {
            return { success: false, error: "Invalid date range" };
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Ensure end of day for endDate to include all transactions of that day
        end.setHours(23, 59, 59, 999);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return { success: false, error: "Invalid date format" };
        }

        // 1. Query database toko (POS system)
        const storeData = await queryStoreDatabase(startDate, endDate);

        if (storeData.length === 0) {
            return {
                success: true,
                data: [],
                message: "Tidak ada transaksi dalam rentang tanggal ini",
                stats: { total: 0, new: 0, duplicate: 0 }
            };
        }

        // EXPLICIT FILTERING - Safety net for date range
        // Filter data to strictly match the requested range (ignoring time)
        // Using strict string comparison on ISO dates (YYYY-MM-DD) to ensure absolute accuracy
        const filteredStoreData = storeData.filter(txn => {
            const txnDate = new Date(txn.transactionDate);
            const txnStr = txnDate.toISOString().split('T')[0]; // "2026-02-02"

            // Allow string comparison
            return txnStr >= startDate && txnStr <= endDate;
        });

        if (filteredStoreData.length === 0) {
            console.log(`Debug: Filtered all data. Input: ${startDate}-${endDate}. Raw count: ${storeData.length}`);
            return {
                success: true,
                data: [],
                message: "No transactions found in this date range (after filter)",
                stats: { total: 0, new: 0, duplicate: 0 }
            };
        }

        // 2. Get conversion rate
        const conversionRate = await getPointConversionRate();

        // 3. Get expiration settings
        const expirationSettings = await prisma.systemSetting.findUnique({
            where: { key: "point_expiration_enabled" },
        });
        const expirationDaysSetting = await prisma.systemSetting.findUnique({
            where: { key: "point_expiration_days" },
        });

        const expirationEnabled = expirationSettings?.value === "true";
        const expirationDays = expirationDaysSetting
            ? parseInt(expirationDaysSetting.value)
            : 90;

        // 4. Batch check for duplicates (OPTIMIZED - single query instead of N queries)
        const memberIds = [...new Set(filteredStoreData.map(row => row.memberId))];
        const existingTransactions = await prisma.transaction.findMany({
            where: {
                member: {
                    memberId: { in: memberIds }
                },
                transactionDate: {
                    gte: start,
                    lte: end
                }
            },
            select: {
                member: {
                    select: {
                        memberId: true
                    }
                },
                transactionDate: true,
                amount: true
            }
        });

        // Create a Set for fast duplicate lookup
        const existingSet = new Set(
            existingTransactions.map(t =>
                `${t.member.memberId}-${t.transactionDate.getTime()}-${t.amount}`
            )
        );

        // 5. Transform data & calculate points (NO database queries in loop)
        const transformedData = filteredStoreData.map((row) => {
            const pointsEarned = calculatePoints(row.amount, conversionRate);

            // Calculate expiry date if enabled
            let pointsExpiryDate: Date | null = null;
            if (expirationEnabled) {
                pointsExpiryDate = new Date(row.transactionDate);
                pointsExpiryDate.setDate(
                    pointsExpiryDate.getDate() + expirationDays
                );
            }

            // Check if transaction exists using Set (O(1) lookup)
            const key = `${row.memberId}-${new Date(row.transactionDate).getTime()}-${row.amount}`;
            const isDuplicate = existingSet.has(key);

            return {
                memberId: row.memberId,
                memberName: row.memberName,
                transactionDate: row.transactionDate,
                amount: row.amount,
                phone: row.phone,
                pointsEarned,
                pointsExpiryDate,
                isDuplicate,
            };
        });

        const newCount = transformedData.filter((t) => !t.isDuplicate).length;
        const duplicateCount = transformedData.filter((t) => t.isDuplicate).length;

        return {
            success: true,
            data: transformedData,
            stats: {
                total: transformedData.length,
                new: newCount,
                duplicate: duplicateCount,
            },
        };
    } catch (error) {
        console.error("Error fetching store transactions:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Save fetched store transactions to reward database
 * Only saves new transactions (skips duplicates)
 */
export async function saveStoreTransactions(transactions: any[]) {
    try {
        let savedCount = 0;
        let skippedCount = 0;
        const errors: string[] = [];

        for (const txn of transactions) {
            try {
                // Skip duplicates
                if (txn.isDuplicate) {
                    skippedCount++;
                    continue;
                }

                // Find or create member
                let member = await prisma.member.findUnique({
                    where: { memberId: txn.memberId },
                });

                if (!member) {
                    member = await prisma.member.create({
                        data: {
                            memberId: txn.memberId,
                            name: txn.memberName,
                            phone: txn.phone,
                        },
                    });
                } else if (txn.phone && !member.phone) {
                    // Update phone if member exists but doesn't have phone
                    await prisma.member.update({
                        where: { id: member.id },
                        data: { phone: txn.phone },
                    });
                }

                // Create transaction
                await prisma.transaction.create({
                    data: {
                        memberId: member.id,
                        transactionDate: new Date(txn.transactionDate),
                        amount: txn.amount,
                        pointsEarned: txn.pointsEarned,
                        pointsExpiryDate: txn.pointsExpiryDate,
                    },
                });

                // Update member totals
                await prisma.member.update({
                    where: { id: member.id },
                    data: {
                        totalPoints: { increment: txn.pointsEarned },
                        totalSpent: { increment: txn.amount },
                        transactionCount: { increment: 1 },
                    },
                });

                savedCount++;
            } catch (error) {
                console.error("Error saving transaction:", error);
                errors.push(
                    `Failed to save transaction for ${txn.memberName}: ${error instanceof Error ? error.message : "Unknown error"}`
                );
            }
        }

        revalidatePath("/transactions");
        revalidatePath("/customers");
        revalidatePath("/");

        return {
            success: true,
            message: `Berhasil menyimpan ${savedCount} transaksi${skippedCount > 0 ? `, ${skippedCount} duplikat dilewati` : ""}`,
            stats: {
                saved: savedCount,
                skipped: skippedCount,
                errors: errors.length,
            },
            errors: errors.length > 0 ? errors : undefined,
        };
    } catch (error) {
        console.error("Error saving store transactions:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
