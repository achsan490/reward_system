"use server";

import { prisma } from "@/lib/prisma";
import { calculatePoints, parseCSV } from "@/lib/pointCalculator";
import { revalidatePath } from "next/cache";

/**
 * Get point conversion rate from system settings
 */
async function getPointConversionRate(): Promise<number> {
    const setting = await prisma.systemSetting.findUnique({
        where: { key: "point_conversion_rate" },
    });

    if (!setting) {
        // Create default setting if not exists
        await prisma.systemSetting.create({
            data: {
                key: "point_conversion_rate",
                value: "5000",
                label: "Point Conversion Rate",
                type: "number",
            },
        });
        return 5000;
    }

    return parseFloat(setting.value);
}

/**
 * Upload and process transaction CSV file
 */
export async function uploadTransactions(formData: FormData) {
    try {
        const file = formData.get("file") as File;

        if (!file) {
            return { success: false, error: "No file uploaded" };
        }

        // Read file content
        const content = await file.text();
        const transactions = parseCSV(content);

        if (transactions.length === 0) {
            return { success: false, error: "No valid transactions found in file" };
        }

        // Get conversion rate
        const conversionRate = await getPointConversionRate();

        // Get expiration settings
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

        // Process transactions
        let processedCount = 0;

        for (const txn of transactions) {
            // Find or create member
            let member = await prisma.member.findUnique({
                where: { memberId: txn.memberId },
            });

            if (!member) {
                member = await prisma.member.create({
                    data: {
                        memberId: txn.memberId,
                        name: txn.memberName,
                        phone: txn.phone, // Save phone if provided
                    },
                });
            } else if (txn.phone && !member.phone) {
                // Update phone if member exists but doesn't have phone
                await prisma.member.update({
                    where: { id: member.id },
                    data: { phone: txn.phone },
                });
            }

            // Calculate points
            const pointsEarned = calculatePoints(txn.amount, conversionRate);

            // Calculate expiry date if expiration is enabled
            const transactionDate = new Date(txn.transactionDate);
            let pointsExpiryDate: Date | null = null;

            if (expirationEnabled) {
                pointsExpiryDate = new Date(transactionDate);
                pointsExpiryDate.setDate(
                    pointsExpiryDate.getDate() + expirationDays
                );
            }

            // Create transaction
            await prisma.transaction.create({
                data: {
                    memberId: member.id,
                    transactionDate: transactionDate,
                    amount: txn.amount,
                    pointsEarned: pointsEarned,
                    pointsExpiryDate: pointsExpiryDate,
                },
            });

            // Update member totals
            await prisma.member.update({
                where: { id: member.id },
                data: {
                    totalPoints: { increment: pointsEarned },
                    totalSpent: { increment: txn.amount },
                    transactionCount: { increment: 1 },
                },
            });

            processedCount++;
        }

        revalidatePath("/transactions");
        revalidatePath("/customers");
        revalidatePath("/");
        return {
            success: true,
            message: `Successfully processed ${processedCount} transactions`,
        };
    } catch (error) {
        console.error("Error uploading transactions:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Get top members by points
 */
export async function getTopMembers(limit: number = 10) {
    try {
        const members = await prisma.member.findMany({
            orderBy: {
                totalPoints: "desc",
            },
            take: limit,
            select: {
                id: true,
                memberId: true,
                name: true,
                phone: true,
                totalPoints: true,
                totalSpent: true,
                transactionCount: true,
            },
        });

        return { success: true, data: members };
    } catch (error) {
        console.error("Error getting top members:", error);
        return { success: false, error: "Failed to fetch top members" };
    }
}

/**
 * Get transaction statistics
 */
export async function getTransactionStats() {
    try {
        const [totalTransactions, totalMembers, totalAmount, totalPoints] =
            await Promise.all([
                prisma.transaction.count(),
                prisma.member.count(),
                prisma.transaction.aggregate({
                    _sum: {
                        amount: true,
                    },
                }),
                prisma.member.aggregate({
                    _sum: {
                        totalPoints: true,
                    },
                }),
            ]);

        return {
            success: true,
            data: {
                totalTransactions,
                totalMembers,
                totalAmount: totalAmount._sum.amount || 0,
                totalPoints: totalPoints._sum.totalPoints || 0,
            },
        };
    } catch (error) {
        console.error("Error getting transaction stats:", error);
        return { success: false, error: "Failed to fetch statistics" };
    }
}

/**
 * Get all transactions with pagination
 */
export async function getTransactions(page: number = 1, limit: number = 20) {
    try {
        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                skip,
                take: limit,
                orderBy: {
                    transactionDate: "desc",
                },
                include: {
                    member: {
                        select: {
                            memberId: true,
                            name: true,
                        },
                    },
                },
            }),
            prisma.transaction.count(),
        ]);

        return {
            success: true,
            data: {
                transactions,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    } catch (error) {
        console.error("Error getting transactions:", error);
        return { success: false, error: "Failed to fetch transactions" };
    }
}

/**
 * Recalculate all points based on current conversion rate
 */
export async function recalculateAllPoints() {
    try {
        const conversionRate = await getPointConversionRate();

        // Get all transactions
        const transactions = await prisma.transaction.findMany({
            include: {
                member: true,
            },
        });

        // Reset all member points
        await prisma.member.updateMany({
            data: {
                totalPoints: 0,
            },
        });

        // Recalculate points for each transaction
        const updates: any[] = [];
        const memberPoints = new Map<string, number>();

        for (const txn of transactions) {
            const newPoints = calculatePoints(txn.amount, conversionRate);

            // Add transaction update to batch
            updates.push(
                prisma.transaction.update({
                    where: { id: txn.id },
                    data: { pointsEarned: newPoints },
                })
            );

            // Accumulate member points
            const currentPoints = memberPoints.get(txn.memberId) || 0;
            memberPoints.set(txn.memberId, currentPoints + newPoints);
        }

        // Add member updates to batch
        for (const [memberId, points] of memberPoints.entries()) {
            updates.push(
                prisma.member.update({
                    where: { id: memberId },
                    data: { totalPoints: points },
                })
            );
        }

        // Execute all updates in a single transaction
        // Split into chunks if there are too many updates to avoid database limits
        const chunkSize = 50;
        for (let i = 0; i < updates.length; i += chunkSize) {
            const chunk = updates.slice(i, i + chunkSize);
            await prisma.$transaction(chunk);
        }

        revalidatePath("/transactions");
        return {
            success: true,
            message: `Successfully recalculated points for ${transactions.length} transactions`,
        };
    } catch (error) {
        console.error("Error recalculating points:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
