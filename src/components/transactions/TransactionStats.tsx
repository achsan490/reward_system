"use client";

import { formatCurrency, formatNumber } from "@/lib/pointCalculator";
import {
    ShoppingCart,
    Users,
    Award,
    DollarSign,
} from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    iconBgColor: string;
    iconColor: string;
}

function StatsCard({ title, value, icon, iconBgColor, iconColor }: StatsCardProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-dark">
            <div className="flex items-center gap-4">
                <div className={`rounded-lg ${iconBgColor} p-3 ${iconColor}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

interface TransactionStatsProps {
    stats: {
        totalTransactions: number;
        totalMembers: number;
        totalAmount: number;
        totalPoints: number;
    };
}

export default function TransactionStats({ stats }: TransactionStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
                title="Total Transaksi"
                value={formatNumber(stats.totalTransactions)}
                icon={<ShoppingCart className="h-6 w-6" />}
                iconBgColor="bg-blue-100 dark:bg-blue-900/20"
                iconColor="text-blue-600 dark:text-blue-400"
            />
            <StatsCard
                title="Total Member"
                value={formatNumber(stats.totalMembers)}
                icon={<Users className="h-6 w-6" />}
                iconBgColor="bg-green-100 dark:bg-green-900/20"
                iconColor="text-green-600 dark:text-green-400"
            />
            <StatsCard
                title="Total Belanja"
                value={formatCurrency(stats.totalAmount)}
                icon={<DollarSign className="h-6 w-6" />}
                iconBgColor="bg-purple-100 dark:bg-purple-900/20"
                iconColor="text-purple-600 dark:text-purple-400"
            />
            <StatsCard
                title="Total Point"
                value={`${formatNumber(stats.totalPoints)} pts`}
                icon={<Award className="h-6 w-6" />}
                iconBgColor="bg-orange-100 dark:bg-orange-900/20"
                iconColor="text-orange-600 dark:text-orange-400"
            />
        </div>
    );
}
