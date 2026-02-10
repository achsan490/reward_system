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
        const errors: string[] = [];
        let skippedCount = 0;

        // Filter valid & non-duplicate transactions
        const validTransactions = transactions.filter(t => {
            if (t.isDuplicate) {
                skippedCount++;
                return false;
            }
            return true;
        });

        if (validTransactions.length === 0) {
            return {
                success: true,
                message: skippedCount > 0
                    ? `Tidak ada transaksi baru. ${skippedCount} duplikat dilewati.`
                    : "Tidak ada transaksi untuk disimpan.",
                stats: { saved: 0, skipped: skippedCount, errors: 0 },
            };
        }

        // 1. Resolve Members (Bulk)
        const distinctMemberIds = Array.from(new Set(validTransactions.map(t => t.memberId)));

        // Find existing members
        const existingMembers = await prisma.member.findMany({
            where: { memberId: { in: distinctMemberIds } },
            select: { id: true, memberId: true, phone: true }
        });

        const existingMemberMap = new Map(existingMembers.map(m => [m.memberId, m]));
        const newMemberIds = distinctMemberIds.filter(id => !existingMemberMap.has(id));

        // Create new members in bulk
        if (newMemberIds.length > 0) {
            const newMembersData = newMemberIds.map(id => {
                const txn = validTransactions.find(t => t.memberId === id);
                return {
                    memberId: id,
                    name: txn?.memberName || "Unknown",
                    phone: txn?.phone || null,
                };
            });

            await prisma.member.createMany({
                data: newMembersData,
                skipDuplicates: true,
            });
        }

        // Re-fetch all members to get their internal IDs (CUIDs)
        const allMembers = await prisma.member.findMany({
            where: { memberId: { in: distinctMemberIds } },
            select: { id: true, memberId: true, phone: true }
        });

        const memberMap = new Map(allMembers.map(m => [m.memberId, m]));

        // 2. Prepare Transactions & Updates
        const transactionData = [];
        const memberStatsUpdates = new Map<string, {
            points: number;
            spent: number;
            count: number;
            phone?: string;
        }>();

        for (const txn of validTransactions) {
            const member = memberMap.get(txn.memberId);
            if (!member) {
                errors.push(`Failed to resolve member ${txn.memberName}`);
                continue;
            }

            // Ensure dates are Date objects
            const transactionDate = new Date(txn.transactionDate);
            const pointsExpiryDate = txn.pointsExpiryDate ? new Date(txn.pointsExpiryDate) : null;

            transactionData.push({
                memberId: member.id,
                transactionDate: transactionDate,
                amount: txn.amount,
                pointsEarned: txn.pointsEarned,
                pointsExpiryDate: pointsExpiryDate,
            });

            // Aggregate Member Updates
            const stats = memberStatsUpdates.get(member.id) || { points: 0, spent: 0, count: 0 };
            stats.points += txn.pointsEarned;
            stats.spent += txn.amount;
            stats.count += 1;

            // Check if we need to update phone
            if (txn.phone && !member.phone && !stats.phone) {
                stats.phone = txn.phone;
            }

            memberStatsUpdates.set(member.id, stats);
        }

        // 3. Execute Bulk Insert Transactions
        if (transactionData.length > 0) {
            await prisma.transaction.createMany({
                data: transactionData,
            });
        }

        // 4. Execute Member Updates (Batched Parallel)
        // 4. Execute Member Updates (Batched Sequential)
        const memberUpdateEntries = Array.from(memberStatsUpdates.entries());
        const BATCH_SIZE = 10; // Small batch size to prevent connection pool exhaustion

        for (let i = 0; i < memberUpdateEntries.length; i += BATCH_SIZE) {
            const batch = memberUpdateEntries.slice(i, i + BATCH_SIZE);

            await Promise.all(batch.map(([id, stats]) => {
                const data: any = {
                    totalPoints: { increment: stats.points || 0 }, // Ensure no undefined increment
                    totalSpent: { increment: stats.spent || 0 },
                    transactionCount: { increment: stats.count || 0 },
                };

                if (stats.phone) {
                    data.phone = stats.phone;
                }

                return prisma.member.update({
                    where: { id },
                    data: data,
                });
            }));
        }



        revalidatePath("/transactions");
        revalidatePath("/customers");
        revalidatePath("/");

        return {
            success: true,
            message: `Berhasil menyimpan ${transactionData.length} transaksi${skippedCount > 0 ? `, ${skippedCount} duplikat dilewati` : ""}`,
            stats: {
                saved: transactionData.length,
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
