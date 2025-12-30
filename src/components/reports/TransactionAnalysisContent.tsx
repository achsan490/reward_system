"use client";

import { Activity, TrendingUp, DollarSign, Users } from "lucide-react";

interface TransactionAnalysisData {
    trends: Array<{ date: string; count: number; amount: number; points: number }>;
    topSpenders: Array<{
        id: string;
        memberId: string;
        name: string;
        totalSpent: number;
        totalPoints: number;
        transactionCount: number;
    }>;
    stats: {
        totalTransactions: number;
        totalAmount: number;
        avgTransaction: number;
        growth: number;
    };
}

export default function TransactionAnalysisContent({ data }: { data: TransactionAnalysisData }) {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Total Transaksi
                            </p>
                            <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                {data.stats.totalTransactions.toLocaleString("id-ID")}
                            </h3>
                        </div>
                        <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/20">
                            <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Total Belanja
                            </p>
                            <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                Rp {(data.stats.totalAmount / 1000000).toFixed(1)}jt
                            </h3>
                        </div>
                        <div className="rounded-xl bg-purple-100 p-3 dark:bg-purple-900/20">
                            <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Rata-rata Transaksi
                            </p>
                            <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                Rp {Math.round(data.stats.avgTransaction / 1000)}k
                            </h3>
                        </div>
                        <div className="rounded-xl bg-green-100 p-3 dark:bg-green-900/20">
                            <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Pertumbuhan
                            </p>
                            <h3 className={`mt-1 text-2xl font-bold ${data.stats.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {data.stats.growth >= 0 ? '+' : ''}{data.stats.growth.toFixed(1)}%
                            </h3>
                        </div>
                        <div className={`rounded-xl p-3 ${data.stats.growth >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                            <TrendingUp className={`h-6 w-6 ${data.stats.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Spenders Table */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Top 10 Member Berbelanja Terbanyak
                </h3>

                {data.topSpenders.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        Belum ada data transaksi
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Rank
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Member
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Total Belanja
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Total Poin
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Transaksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
                                {data.topSpenders.map((member, index) => (
                                    <tr
                                        key={member.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
                                                    index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' :
                                                        index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' :
                                                            'bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-500'
                                                }`}>
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {member.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {member.memberId}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                                            Rp {member.totalSpent.toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-brand-600 dark:text-brand-400">
                                            {member.totalPoints.toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-4 py-3 text-gray-900 dark:text-white">
                                            {member.transactionCount}x
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
