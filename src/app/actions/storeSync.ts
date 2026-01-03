"use server";

import { prisma } from "@/lib/prisma";
import { calculatePoints } from "@/lib/pointCalculator";
import { queryStoreDatabaseDummy } from "@/lib/storeDatabaseDummy";
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
        // 1. Query database toko (dummy data untuk sekarang)
        const storeData = await queryStoreDatabaseDummy(startDate, endDate);

        if (storeData.length === 0) {
            return {
                success: true,
                data: [],
                message: "Tidak ada transaksi dalam rentang tanggal ini",
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

        // 4. Transform data & calculate points
        const transformedData = await Promise.all(
            storeData.map(async (row) => {
                const pointsEarned = calculatePoints(row.amount, conversionRate);

                // Calculate expiry date if enabled
                let pointsExpiryDate: Date | null = null;
                if (expirationEnabled) {
                    pointsExpiryDate = new Date(row.transactionDate);
                    pointsExpiryDate.setDate(
                        pointsExpiryDate.getDate() + expirationDays
                    );
                }

                // Check if transaction already exists (duplicate detection)
                const exists = await prisma.transaction.findFirst({
                    where: {
                        member: { memberId: row.memberId },
                        transactionDate: row.transactionDate,
                        amount: row.amount,
                    },
                });

                return {
                    memberId: row.memberId,
                    memberName: row.memberName,
                    transactionDate: row.transactionDate,
                    amount: row.amount,
                    phone: row.phone,
                    pointsEarned,
                    pointsExpiryDate,
                    isDuplicate: !!exists,
                    existingId: exists?.id,
                };
            })
        );

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
