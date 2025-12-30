import { Users, Award, ShoppingCart, TrendingUp } from "lucide-react";

interface CustomerStatsProps {
    stats: {
        totalCustomers: number;
        totalPoints: number;
        totalSpent: number;
        avgTransactionsPerCustomer: number;
    };
}

export default function CustomerStats({ stats }: CustomerStatsProps) {
    const statCards = [
        {
            title: "Total Pelanggan",
            value: stats.totalCustomers.toLocaleString("id-ID"),
            icon: Users,
            color: "bg-blue-500",
            lightBg: "bg-blue-50 dark:bg-blue-900/20",
            textColor: "text-blue-600 dark:text-blue-400",
        },
        {
            title: "Total Points Terdistribusi",
            value: stats.totalPoints.toLocaleString("id-ID"),
            icon: Award,
            color: "bg-purple-500",
            lightBg: "bg-purple-50 dark:bg-purple-900/20",
            textColor: "text-purple-600 dark:text-purple-400",
        },
        {
            title: "Total Belanja Keseluruhan",
            value: `Rp ${stats.totalSpent.toLocaleString("id-ID")}`,
            icon: ShoppingCart,
            color: "bg-green-500",
            lightBg: "bg-green-50 dark:bg-green-900/20",
            textColor: "text-green-600 dark:text-green-400",
        },
        {
            title: "Rata-rata Transaksi/Pelanggan",
            value: stats.avgTransactionsPerCustomer.toFixed(1),
            icon: TrendingUp,
            color: "bg-orange-500",
            lightBg: "bg-orange-50 dark:bg-orange-900/20",
            textColor: "text-orange-600 dark:text-orange-400",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.title}
                        className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-dark"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {stat.title}
                                </p>
                                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`${stat.lightBg} rounded-lg p-3`}>
                                <Icon className={`h-6 w-6 ${stat.textColor}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
