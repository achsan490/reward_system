"use server";

import { prisma } from "@/lib/prisma";
import { getExpirationStats } from "./point-expiration";
import { unstable_noStore as noStore } from "next/cache";

/**
 * Get aggregated dashboard statistics
 */
export async function getDashboardStats() {
    noStore();
    try {
        // Run queries sequentially to spare connection pool
        const totalMembers = await prisma.member.count();
        const totalActiveCampaigns = await prisma.rewardCampaign.count({
            where: { status: "active" },
        });
        const totalRewardsClaimed = await prisma.rewardWinner.count({
            where: { rewardClaimed: true },
        });
        const totalTransactions = await prisma.transaction.count();

        const transactionAggregates = await prisma.transaction.aggregate({
            _sum: {
                amount: true,
                pointsEarned: true,
            },
        });

        // Optimization: Run this last or parallel if absolutely necessary, but keep sequential for safety now
        const expirationStats = await getExpirationStats();

        const expirationData = expirationStats.success
            ? expirationStats.data
            : {
                enabled: false,
                pointsExpiringSoon: 0,
                membersWithExpiringPoints: 0,
                pointsExpiredTotal: 0,
            };

        return {
            success: true,
            data: {
                totalMembers,
                totalActiveCampaigns,
                totalRewardsClaimed,
                totalTransactions,
                totalAmount: transactionAggregates._sum.amount ?? 0,
                totalPoints: transactionAggregates._sum.pointsEarned ?? 0,
                pointsExpiringSoon: expirationData?.pointsExpiringSoon ?? 0,
                membersWithExpiringPoints:
                    expirationData?.membersWithExpiringPoints ?? 0,
            },
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { success: false, error: "Failed to fetch dashboard stats" };
    }
}

/**
 * Get chart data aggregated by month (Last 6 months)
 */
export async function getDashboardChartData() {
    noStore();
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Group transactions by month using Prisma
        // Note: Prisma groupBy doesn't support advanced date extraction easily across all DBs
        // So we'll fetch raw and aggregate in JS for flexibility
        const transactions = await prisma.transaction.findMany({
            where: {
                transactionDate: {
                    gte: sixMonthsAgo,
                },
            },
            select: {
                transactionDate: true,
                amount: true,
                pointsEarned: true,
            },
            orderBy: {
                transactionDate: "asc",
            },
        });

        const groupedData = transactions.reduce((acc, curr) => {
            const month = curr.transactionDate.toLocaleString("default", {
                month: "short",
                year: "2-digit",
            });
            if (!acc[month]) {
                acc[month] = {
                    date: month,
                    totalSpent: 0,
                    totalPoints: 0,
                };
            }
            acc[month].totalSpent += curr.amount;
            acc[month].totalPoints += curr.pointsEarned;
            return acc;
        }, {} as Record<string, { date: string; totalSpent: number; totalPoints: number }>);

        return {
            success: true,
            data: Object.values(groupedData),
        };
    } catch (error) {
        console.error("Error fetching chart data:", error);
        return { success: false, error: "Failed to fetch chart data" };
    }
}

/**
 * Get recent activity (Mixed Transactions & Reward Winners)
 */
export async function getRecentActivity() {
    noStore();
    try {
        // Run sequentially
        const recentTransactions = await prisma.transaction.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { member: { select: { name: true } } },
        });

        const recentWinners = await prisma.rewardWinner.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                member: { select: { name: true } },
                campaign: { select: { name: true } },
            },
        });

        // Transform and merge
        const activities = [
            ...recentTransactions.map((t) => ({
                id: t.id,
                type: "transaction" as const,
                title: "Transaksi Baru",
                description: `${t.member.name} - Rp ${t.amount.toLocaleString("id-ID")}`,
                date: t.transactionDate,
                amount: t.amount,
            })),
            ...recentWinners.map((w) => ({
                id: w.id,
                type: "reward" as const,
                title: "Pemenang Reward",
                description: `${w.member.name} menang di ${w.campaign.name}`,
                date: w.createdAt,
                amount: 0,
            })),
        ]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);

        return { success: true, data: activities };
    } catch (error) {
        console.error("Error fetching recent activity:", error);
        return { success: false, error: "Failed to fetch activity" };
    }
}
