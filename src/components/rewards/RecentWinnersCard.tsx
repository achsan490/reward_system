"use client";

import { Trophy, TrendingUp, DollarSign, ShoppingCart } from "lucide-react";

interface Member {
    id: string;
    memberId: string;
    name: string;
    totalPoints: number;
    totalSpent: number;
    transactionCount: number;
}

interface RecentWinnersCardProps {
    members: Member[];
}

export default function RecentWinnersCard({ members }: RecentWinnersCardProps) {
    const getRankIcon = (index: number) => {
        if (index === 0) {
            return (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600">
                    <Trophy className="h-4 w-4 text-white" />
                </div>
            );
        } else if (index === 1) {
            return (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-500">
                    <Trophy className="h-4 w-4 text-white" />
                </div>
            );
        } else if (index === 2) {
            return (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600">
                    <Trophy className="h-4 w-4 text-white" />
                </div>
            );
        } else {
            return (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {index + 1}
                    </span>
                </div>
            );
        }
    };

    if (members.length === 0) {
        return null;
    }

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Top Member Saat Ini
                </h3>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">
                    Preview
                </span>
            </div>

            <div className="space-y-3">
                {members.map((member, index) => (
                    <div
                        key={member.id}
                        className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                    >
                        {getRankIcon(index)}

                        <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">
                                {member.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {member.memberId}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-right">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Points
                                </p>
                                <p className="font-semibold text-brand-600 dark:text-brand-400">
                                    {member.totalPoints.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Belanja
                                </p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    Rp{" "}
                                    {(member.totalSpent / 1000).toFixed(0)}K
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Transaksi
                                </p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {member.transactionCount}x
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                💡 Data ini menampilkan top 5 member berdasarkan total poin. Buat
                campaign baru untuk menentukan pemenang reward resmi.
            </p>
        </div>
    );
}
