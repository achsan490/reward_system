"use client";

import { Users, Trophy, DollarSign, Activity, AlertCircle } from "lucide-react";

interface DashboardStatsCardsProps {
    stats: {
        totalMembers: number;
        totalActiveCampaigns: number;
        totalRewardsClaimed: number;
        totalTransactions: number;
        totalAmount: number;
        totalPoints: number;
        pointsExpiringSoon?: number;
        membersWithExpiringPoints?: number;
    };
}

export default function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
    const cards = [
        {
            title: "Total Transaksi",
            value: stats.totalTransactions.toLocaleString("id-ID"),
            icon: Activity,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
            title: "Total Member",
            value: stats.totalMembers.toLocaleString("id-ID"),
            icon: Users,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-900/20",
        },
        {
            title: "Total Belanja",
            value: `Rp ${stats.totalAmount.toLocaleString("id-ID")}`,
            icon: DollarSign,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
        },
        {
            title: "Total Poin",
            value: stats.totalPoints.toLocaleString("id-ID"),
            icon: Trophy,
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-100 dark:bg-orange-900/20",
        },
    ];



    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {card.title}
                                </p>
                                <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                    {card.value}
                                </h3>
                            </div>
                            <div className={`rounded-xl p-3 ${card.bgColor}`}>
                                <Icon className={`h-6 w-6 ${card.color}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
