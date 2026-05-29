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
    return expirePoints();
}

/**
 * Get members with expiring redemption tickets (not points!)
 */
export async function getMembersWithExpiringPoints(thresholdDays: number = 30) {
    try {
        const settings = await getPointExpirationSettings();
        if (!settings.success || !settings.data?.enabled) {
            return { success: true, data: [] };
        }

        const { days: expirationDays } = settings.data;
        const now = new Date();
        
        // Expiry Date = processedAt + expirationDays.
        // Expiring soon: expiry date between now and (now + thresholdDays)
        // processedAt + expirationDays >= now  =>  processedAt >= now - expirationDays
        // processedAt + expirationDays <= now + thresholdDays  =>  processedAt <= now + thresholdDays - expirationDays
        const minProcessedAt = new Date(now);
        minProcessedAt.setDate(now.getDate() - expirationDays);

        const maxProcessedAt = new Date(now);
        maxProcessedAt.setDate(now.getDate() + thresholdDays - expirationDays);

        const expiringRedemptions = await prisma.rewardRedemption.findMany({
            where: {
                status: "approved",
                processedAt: {
                    gte: minProcessedAt,
                    lte: maxProcessedAt,
                },
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
                catalog: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                processedAt: "asc",
            },
        });

        // Group by member
        const memberMap = new Map();

        for (const redemption of expiringRedemptions) {
            if (!redemption.processedAt) continue;
            
            const memberId = redemption.member.id;
            const expiryDate = new Date(redemption.processedAt);
            expiryDate.setDate(expiryDate.getDate() + expirationDays);

            if (!memberMap.has(memberId)) {
                memberMap.set(memberId, {
                    member: redemption.member,
                    totalExpiringPoints: 0,
                    earliestExpiryDate: expiryDate,
                    expiringTransactions: [], // Keep array to avoid breaking typings
                });
            }

            const memberData = memberMap.get(memberId);
            memberData.totalExpiringPoints += redemption.pointsUsed;
            memberData.expiringTransactions.push({
                id: redemption.id,
                transactionDate: redemption.redeemedAt, // date of request
                amount: 0,
                pointsEarned: redemption.pointsUsed,
                pointsExpiryDate: expiryDate,
                rewardName: redemption.catalog.name,
                claimCode: redemption.claimCode.toUpperCase(),
            });

            if (expiryDate < memberData.earliestExpiryDate) {
                memberData.earliestExpiryDate = expiryDate;
            }
        }

        const result = Array.from(memberMap.values());
        return { success: true, data: result };
    } catch (error) {
        console.error("Error getting members with expiring redemptions:", error);
        return {
            success: false,
            error: "Failed to fetch expiring redemptions",
        };
    }
}

/**
 * Expire redemptions that have passed their claim validity date
 */
export async function expirePoints() {
    try {
        const settings = await getPointExpirationSettings();
        if (!settings.success || !settings.data?.enabled) {
            return {
                success: false,
                error: "Redemption expiration is not enabled",
            };
        }

        const { days: expirationDays } = settings.data;
        const now = new Date();
        const expiryThreshold = new Date(now);
        expiryThreshold.setDate(now.getDate() - expirationDays);

        // Find applicable redemptions
        const expiredRedemptions = await prisma.rewardRedemption.updateMany({
            where: {
                status: "approved",
                processedAt: {
                    lt: expiryThreshold,
                },
            },
            data: {
                status: "expired",
            },
        });

        if (expiredRedemptions.count > 0) {
            revalidatePath("/redemption-requests");
            revalidatePath("/member/my-redemptions");
            revalidatePath("/");
        }

        return {
            success: true,
            message: `Berhasil memperbarui ${expiredRedemptions.count} tiket penukaran kadaluarsa.`,
            data: {
                transactionsExpired: expiredRedemptions.count,
                totalPointsExpired: 0,
                membersAffected: 0,
            },
        };
    } catch (error) {
        console.error("Error running expirePoints wrapper:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Get expiring redemptions for a specific member
 */
export async function getMemberExpiringPoints(memberId: string) {
    try {
        const settings = await getPointExpirationSettings();
        if (!settings.success || !settings.data?.enabled) {
            return { success: true, data: null };
        }

        const { days: expirationDays } = settings.data;
        const now = new Date();
        
        // Find approved redemptions that have not expired yet
        const minProcessedAt = new Date(now);
        minProcessedAt.setDate(now.getDate() - expirationDays);

        const redemptions = await prisma.rewardRedemption.findMany({
            where: {
                memberId,
                status: "approved",
                processedAt: {
                    gte: minProcessedAt,
                },
            },
            include: {
                catalog: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                processedAt: "asc",
            },
        });

        const formattedTransactions = redemptions.map((r) => {
            const expiryDate = new Date(r.processedAt!);
            expiryDate.setDate(expiryDate.getDate() + expirationDays);

            return {
                id: r.id,
                transactionDate: r.redeemedAt,
                amount: 0,
                pointsEarned: r.pointsUsed,
                pointsExpiryDate: expiryDate,
                pointsExpired: false,
                description: `Klaim Reward: ${r.catalog.name} (Kode: ${r.claimCode.toUpperCase()})`,
            };
        });

        const totalExpiringPoints = formattedTransactions.reduce(
            (sum, txn) => sum + txn.pointsEarned,
            0
        );

        return {
            success: true,
            data: {
                transactions: formattedTransactions,
                totalExpiringPoints,
                earliestExpiryDate:
                    formattedTransactions.length > 0
                        ? formattedTransactions[0].pointsExpiryDate
                        : null,
            },
        };
    } catch (error) {
        console.error("Error getting member expiring redemptions:", error);
        return {
            success: false,
            error: "Failed to fetch member expiring redemptions",
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

        const { days: expirationDays } = settings.data;
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Expiring soon (approved, expires within next 30 days)
        // processedAt + expirationDays >= now
        // processedAt + expirationDays <= now + 30 days
        const minProcessedAtExpiring = new Date(now);
        minProcessedAtExpiring.setDate(now.getDate() - expirationDays);

        const maxProcessedAtExpiring = new Date(now);
        maxProcessedAtExpiring.setDate(now.getDate() + 30 - expirationDays);

        const expiringSoonRedemptions = await prisma.rewardRedemption.findMany({
            where: {
                status: "approved",
                processedAt: {
                    gte: minProcessedAtExpiring,
                    lte: maxProcessedAtExpiring,
                },
            },
            select: {
                pointsUsed: true,
                memberId: true,
            },
        });

        const pointsExpiringSoon = expiringSoonRedemptions.reduce((sum, r) => sum + r.pointsUsed, 0);
        const membersWithExpiringPoints = [...new Set(expiringSoonRedemptions.map(r => r.memberId))].length;

        // Total expired redemptions (status === "expired")
        const expiredRedemptionsAgg = await prisma.rewardRedemption.aggregate({
            where: {
                status: "expired",
            },
            _sum: {
                pointsUsed: true,
            },
        });

        return {
            success: true,
            data: {
                enabled: true,
                pointsExpiringSoon,
                membersWithExpiringPoints,
                pointsExpiredTotal: expiredRedemptionsAgg._sum.pointsUsed || 0,
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
