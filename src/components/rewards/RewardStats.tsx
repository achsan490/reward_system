"use client";

import { Award, Trophy, Gift, CheckCircle2, Users, DollarSign } from "lucide-react";

interface RewardStatsProps {
    stats: {
        totalMembers: number;
        totalPoints: number;
        topThreePoints: string | number; // Changed to allow formatted string
        topWinnerName: string;          // Changed to hold name
    };
}

export default function RewardStats({ stats }: RewardStatsProps) {
    const statCards = [
        {
            title: "Total Member",
            value: stats.totalMembers.toLocaleString("id-ID"),
            icon: Users,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            title: "Total Poin Member",
            value: stats.totalPoints.toLocaleString("id-ID"),
            icon: DollarSign,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-50 dark:bg-green-900/20",
        },
        {
            title: "Top 3 Point Tertinggi",
            value: stats.topThreePoints,
            icon: Trophy,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            isSmallText: true, // Flag baru untuk text lebih kecil jika panjang
        },
        {
            title: "Calon Pemenang Utama",
            value: stats.topWinnerName,
            icon: Award,
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-50 dark:bg-orange-900/20",
            isSmallText: true,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.title}
                        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {stat.title}
                                </p>
                                <p
                                    className={`mt-2 font-bold text-gray-900 dark:text-white ${stat.isSmallText ? "text-lg" : "text-3xl"
                                        }`}
                                >
                                    {stat.value}
                                </p>
                            </div>
                            <div
                                className={`rounded-full p-3 ${stat.bgColor}`}
                            >
                                <Icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
