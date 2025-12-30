"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { calculateExpiryDate, isExpired } from "@/lib/expirationUtils";

/**
 * Get point expiration settings
 */
export async function getPointExpirationSettings() {
    try {
        const [enabledSetting, daysSetting] = await Promise.all([
            prisma.systemSetting.findUnique({
                where: { key: "point_expiration_enabled" },
            }),
            prisma.systemSetting.findUnique({
                where: { key: "point_expiration_days" },
            }),
        ]);

        return {
            success: true,
            data: {
                enabled: enabledSetting?.value === "true",
                days: daysSetting ? parseInt(daysSetting.value) : 90,
            },
        };
    } catch (error) {
        console.error("Error getting point expiration settings:", error);
        return {
            success: false,
            error: "Failed to fetch expiration settings",
        };
    }
}

/**
 * Update point expiration settings
 */
export async function updatePointExpirationSettings(
    enabled: boolean,
    days: number
) {
    try {
        if (days <= 0) {
            return {
                success: false,
                error: "Expiration days must be greater than 0",
            };
        }

        await Promise.all([
            prisma.systemSetting.upsert({
                where: { key: "point_expiration_enabled" },
                update: { value: enabled.toString() },
                create: {
                    key: "point_expiration_enabled",
                    value: enabled.toString(),
                    label: "Point Expiration Enabled",
                    type: "boolean",
                },
            }),
            prisma.systemSetting.upsert({
                where: { key: "point_expiration_days" },
                update: { value: days.toString() },
                create: {
                    key: "point_expiration_days",
                    value: days.toString(),
                    label: "Point Expiration Days",
                    type: "number",
                },
            }),
        ]);

        revalidatePath("/settings");
        return {
            success: true,
            message: "Expiration settings updated successfully",
        };
    } catch (error) {
        console.error("Error updating expiration settings:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Apply expiration dates to all existing transactions
 */
export async function applyExpirationToTransactions() {
    try {
        const settings = await getPointExpirationSettings();
        if (!settings.success || !settings.data) {
            return { success: false, error: "Failed to get settings" };
        }

        const { enabled, days } = settings.data;

        if (!enabled) {
            return {
                success: false,
                error: "Point expiration is not enabled",
            };
        }

        // Get all transactions without expiry date
        const transactions = await prisma.transaction.findMany({
            where: {
                pointsExpiryDate: null,
            },
        });

        // Update each transaction with expiry date
        for (const txn of transactions) {
            const expiryDate = calculateExpiryDate(txn.transactionDate, days);

            await prisma.transaction.update({
                where: { id: txn.id },
                data: {
                    pointsExpiryDate: expiryDate,
                    pointsExpired: isExpired(expiryDate),
                },
            });
        }

        revalidatePath("/settings");
        revalidatePath("/transactions");
        revalidatePath("/customers");

        return {
            success: true,
            message: `Applied expiration dates to ${transactions.length} transactions`,
        };
    } catch (error) {
        console.error("Error applying expiration to transactions:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Get members with expiring points
 */
export async function getMembersWithExpiringPoints(thresholdDays: number = 30) {
    try {
        const settings = await getPointExpirationSettings();
        if (!settings.success || !settings.data?.enabled) {
            return { success: true, data: [] };
        }

        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + thresholdDays);

        // Get transactions with points expiring within threshold
        const expiringTransactions = await prisma.transaction.findMany({
            where: {
                pointsExpiryDate: {
                    lte: thresholdDate,
                    gte: new Date(),
                },
                pointsExpired: false,
            },
            include: {
                member: {
                    select: {
                        id: true,
                        memberId: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                pointsExpiryDate: "asc",
            },
        });

        // Group by member and calculate totals
        const memberMap = new Map();

        for (const txn of expiringTransactions) {
            const memberId = txn.member.id;

            if (!memberMap.has(memberId)) {
                memberMap.set(memberId, {
                    member: txn.member,
                    totalExpiringPoints: 0,
                    earliestExpiryDate: txn.pointsExpiryDate,
                    expiringTransactions: [],
                });
            }

            const memberData = memberMap.get(memberId);
            memberData.totalExpiringPoints += txn.pointsEarned;
            memberData.expiringTransactions.push({
                id: txn.id,
                transactionDate: txn.transactionDate,
                amount: txn.amount,
                pointsEarned: txn.pointsEarned,
                pointsExpiryDate: txn.pointsExpiryDate,
            });

            if (
                txn.pointsExpiryDate &&
                txn.pointsExpiryDate < memberData.earliestExpiryDate
            ) {
                memberData.earliestExpiryDate = txn.pointsExpiryDate;
            }
        }

        const result = Array.from(memberMap.values());

        return { success: true, data: result };
    } catch (error) {
        console.error("Error getting members with expiring points:", error);
        return {
            success: false,
            error: "Failed to fetch expiring points",
        };
    }
}

/**
 * Expire points that have passed their expiry date
 */
export async function expirePoints() {
    try {
        const settings = await getPointExpirationSettings();
        if (!settings.success || !settings.data?.enabled) {
            return {
                success: false,
                error: "Point expiration is not enabled",
            };
        }

        const now = new Date();

        // Find all transactions with expired points
        const expiredTransactions = await prisma.transaction.findMany({
            where: {
                pointsExpiryDate: {
                    lt: now,
                },
                pointsExpired: false,
            },
            include: {
                member: true,
            },
        });

        let totalPointsExpired = 0;
        const memberUpdates = new Map<string, number>();

        // Mark transactions as expired and calculate member point deductions
        for (const txn of expiredTransactions) {
            await prisma.transaction.update({
                where: { id: txn.id },
                data: { pointsExpired: true },
            });

            totalPointsExpired += txn.pointsEarned;

            const currentDeduction = memberUpdates.get(txn.memberId) || 0;
            memberUpdates.set(txn.memberId, currentDeduction + txn.pointsEarned);
        }

        // Update member total points
        for (const [memberId, pointsToDeduct] of memberUpdates.entries()) {
            await prisma.member.update({
                where: { id: memberId },
                data: {
                    totalPoints: {
                        decrement: pointsToDeduct,
                    },
                },
            });
        }

        revalidatePath("/");
        revalidatePath("/transactions");
        revalidatePath("/customers");

        return {
            success: true,
            message: `Expired ${totalPointsExpired} points from ${expiredTransactions.length} transactions`,
            data: {
                transactionsExpired: expiredTransactions.length,
                totalPointsExpired,
                membersAffected: memberUpdates.size,
            },
        };
    } catch (error) {
        console.error("Error expiring points:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Get expiring points for a specific member
 */
export async function getMemberExpiringPoints(memberId: string) {
    try {
        const settings = await getPointExpirationSettings();
        if (!settings.success || !settings.data?.enabled) {
            return { success: true, data: null };
        }

        const transactions = await prisma.transaction.findMany({
            where: {
                memberId,
                pointsExpiryDate: {
                    gte: new Date(),
                },
                pointsExpired: false,
            },
            orderBy: {
                pointsExpiryDate: "asc",
            },
        });

        const totalExpiringPoints = transactions.reduce(
            (sum, txn) => sum + txn.pointsEarned,
            0
        );

        return {
            success: true,
            data: {
                transactions,
                totalExpiringPoints,
                earliestExpiryDate:
                    transactions.length > 0
                        ? transactions[0].pointsExpiryDate
                        : null,
            },
        };
    } catch (error) {
        console.error("Error getting member expiring points:", error);
        return {
            success: false,
            error: "Failed to fetch member expiring points",
        };
    }
}

/**
 * Get expiration statistics for dashboard
 */
export async function getExpirationStats() {
    try {
        const settings = await getPointExpirationSettings();
        if (!settings.success || !settings.data?.enabled) {
            return {
                success: true,
                data: {
                    enabled: false,
                    pointsExpiringSoon: 0,
                    membersWithExpiringPoints: 0,
                    pointsExpiredTotal: 0,
                },
            };
        }

        const [expiringSoon, expired] = await Promise.all([
            // Points expiring in next 30 days
            prisma.transaction.aggregate({
                where: {
                    pointsExpiryDate: {
                        lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        gte: new Date(),
                    },
                    pointsExpired: false,
                },
                _sum: {
                    pointsEarned: true,
                },
            }),
            // Total expired points
            prisma.transaction.aggregate({
                where: {
                    pointsExpired: true,
                },
                _sum: {
                    pointsEarned: true,
                },
            }),
        ]);

        // Count unique members with expiring points
        const membersWithExpiring = await prisma.transaction.findMany({
            where: {
                pointsExpiryDate: {
                    lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    gte: new Date(),
                },
                pointsExpired: false,
            },
            select: {
                memberId: true,
            },
            distinct: ["memberId"],
        });

        return {
            success: true,
            data: {
                enabled: true,
                pointsExpiringSoon: expiringSoon._sum.pointsEarned || 0,
                membersWithExpiringPoints: membersWithExpiring.length,
                pointsExpiredTotal: expired._sum.pointsEarned || 0,
            },
        };
    } catch (error) {
        console.error("Error getting expiration stats:", error);
        return {
            success: false,
            error: "Failed to fetch expiration statistics",
        };
    }
}
