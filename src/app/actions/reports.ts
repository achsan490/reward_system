"use server";

import { prisma } from "@/lib/prisma";
import { getPointExpirationSettings } from "./point-expiration";
import { unstable_noStore as noStore } from "next/cache";

/**
 * Get expiration report with statistics and timeline
 */
export async function getExpirationReport(dateRange?: {
    startDate?: Date;
    endDate?: Date;
}) {
    noStore();
    try {
        const settings = await getPointExpirationSettings();
        if (!settings.success || !settings.data?.enabled) {
            return {
                success: true,
                data: {
                    summary: {
                        totalExpired: 0,
                        totalExpiringSoon: 0,
                        affectedMembers: 0,
                        totalValueLost: 0,
                    },
                    timeline: [],
                    memberList: [],
                },
            };
        }

        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Get expired transactions
        const expiredTransactions = await prisma.transaction.findMany({
            where: {
                pointsExpired: true,
                ...(dateRange?.startDate && {
                    pointsExpiryDate: { gte: dateRange.startDate },
                }),
                ...(dateRange?.endDate && {
                    pointsExpiryDate: { lte: dateRange.endDate },
                }),
            },
            select: {
                pointsEarned: true,
                pointsExpiryDate: true,
            },
        });

        // Get expiring soon transactions
        const expiringSoonTransactions = await prisma.transaction.findMany({
            where: {
                pointsExpired: false,
                pointsExpiryDate: {
                    gte: now,
                    lte: thirtyDaysFromNow,
                },
            },
            select: {
                pointsEarned: true,
                pointsExpiryDate: true,
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
        });

        // Calculate summary
        const totalExpired = expiredTransactions.reduce(
            (sum, t) => sum + t.pointsEarned,
            0
        );
        const totalExpiringSoon = expiringSoonTransactions.reduce(
            (sum, t) => sum + t.pointsEarned,
            0
        );

        // Group by member for member list
        const memberMap = new Map();
        for (const txn of expiringSoonTransactions) {
            const memberId = txn.member.id;
            if (!memberMap.has(memberId)) {
                memberMap.set(memberId, {
                    member: txn.member,
                    expiringPoints: 0,
                    earliestExpiryDate: txn.pointsExpiryDate,
                    transactionCount: 0,
                });
            }
            const data = memberMap.get(memberId);
            data.expiringPoints += txn.pointsEarned;
            data.transactionCount += 1;
            if (
                txn.pointsExpiryDate &&
                txn.pointsExpiryDate < data.earliestExpiryDate
            ) {
                data.earliestExpiryDate = txn.pointsExpiryDate;
            }
        }

        const memberList = Array.from(memberMap.values()).sort(
            (a, b) => b.expiringPoints - a.expiringPoints
        );

        // Generate timeline (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const timelineTransactions = await prisma.transaction.findMany({
            where: {
                pointsExpiryDate: {
                    gte: sixMonthsAgo,
                },
            },
            select: {
                pointsEarned: true,
                pointsExpiryDate: true,
                pointsExpired: true,
            },
        });

        // Group by month
        const timelineMap = new Map<string, { expired: number; expiring: number }>();
        for (const txn of timelineTransactions) {
            if (!txn.pointsExpiryDate) continue;

            const monthKey = txn.pointsExpiryDate.toLocaleString("default", {
                month: "short",
                year: "2-digit",
            });

            if (!timelineMap.has(monthKey)) {
                timelineMap.set(monthKey, { expired: 0, expiring: 0 });
            }

            const data = timelineMap.get(monthKey)!;
            if (txn.pointsExpired) {
                data.expired += txn.pointsEarned;
            } else {
                data.expiring += txn.pointsEarned;
            }
        }

        const timeline = Array.from(timelineMap.entries()).map(([month, data]) => ({
            month,
            ...data,
        }));

        return {
            success: true,
            data: {
                summary: {
                    totalExpired,
                    totalExpiringSoon,
                    affectedMembers: memberList.length,
                    totalValueLost: totalExpired,
                },
                timeline,
                memberList,
            },
        };
    } catch (error) {
        console.error("Error getting expiration report:", error);
        return {
            success: false,
            error: "Failed to generate expiration report",
        };
    }
}

/**
 * Get transaction analysis with trends and insights
 */
export async function getTransactionAnalysis(dateRange?: {
    startDate?: Date;
    endDate?: Date;
}) {
    noStore();
    try {
        const startDate = dateRange?.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const endDate = dateRange?.endDate || new Date();

        // Get transactions in range
        const transactions = await prisma.transaction.findMany({
            where: {
                transactionDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                transactionDate: true,
                amount: true,
                pointsEarned: true,
                memberId: true,
            },
            orderBy: {
                transactionDate: "asc",
            },
        });

        // Calculate trends (group by day)
        const trendsMap = new Map<string, { count: number; amount: number; points: number }>();
        for (const txn of transactions) {
            const dateKey = txn.transactionDate.toLocaleDateString("id-ID");
            if (!trendsMap.has(dateKey)) {
                trendsMap.set(dateKey, { count: 0, amount: 0, points: 0 });
            }
            const data = trendsMap.get(dateKey)!;
            data.count += 1;
            data.amount += txn.amount;
            data.points += txn.pointsEarned;
        }

        const trends = Array.from(trendsMap.entries()).map(([date, data]) => ({
            date,
            ...data,
        }));

        // Get top spenders
        const memberSpending = await prisma.member.findMany({
            orderBy: {
                totalSpent: "desc",
            },
            take: 10,
            select: {
                id: true,
                memberId: true,
                name: true,
                totalSpent: true,
                totalPoints: true,
                transactionCount: true,
            },
        });

        // Calculate stats
        const totalTransactions = transactions.length;
        const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
        const avgTransaction = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

        // Calculate growth (compare with previous period)
        const periodDays = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const previousStart = new Date(startDate.getTime() - periodDays * 24 * 60 * 60 * 1000);

        const previousTransactions = await prisma.transaction.count({
            where: {
                transactionDate: {
                    gte: previousStart,
                    lt: startDate,
                },
            },
        });

        const growth =
            previousTransactions > 0
                ? ((totalTransactions - previousTransactions) / previousTransactions) * 100
                : 0;

        return {
            success: true,
            data: {
                trends,
                topSpenders: memberSpending,
                stats: {
                    totalTransactions,
                    totalAmount,
                    avgTransaction,
                    growth,
                },
            },
        };
    } catch (error) {
        console.error("Error getting transaction analysis:", error);
        return {
            success: false,
            error: "Failed to generate transaction analysis",
        };
    }
}

/**
 * Get point analysis and distribution
 */
export async function getPointAnalysis() {
    noStore();
    try {
        // Get all members with points
        const members = await prisma.member.findMany({
            select: {
                totalPoints: true,
            },
        });

        // Get point distribution
        const totalPointsIssued = await prisma.transaction.aggregate({
            _sum: {
                pointsEarned: true,
            },
        });

        const totalPointsExpired = await prisma.transaction.aggregate({
            where: {
                pointsExpired: true,
            },
            _sum: {
                pointsEarned: true,
            },
        });

        const totalActivePoints = members.reduce((sum, m) => sum + m.totalPoints, 0);

        const pointsIssued = totalPointsIssued._sum.pointsEarned || 0;
        const pointsExpired = totalPointsExpired._sum.pointsEarned || 0;
        const pointsRedeemed = pointsIssued - totalActivePoints - pointsExpired;

        const conversionRate =
            pointsIssued > 0 ? (pointsRedeemed / pointsIssued) * 100 : 0;

        return {
            success: true,
            data: {
                pointsIssued,
                pointsActive: totalActivePoints,
                pointsRedeemed,
                pointsExpired,
                conversionRate,
                distribution: {
                    active: totalActivePoints,
                    redeemed: pointsRedeemed,
                    expired: pointsExpired,
                },
            },
        };
    } catch (error) {
        console.error("Error getting point analysis:", error);
        return {
            success: false,
            error: "Failed to generate point analysis",
        };
    }
}
