"use client";

import { formatCurrency, formatNumber } from "@/lib/pointCalculator";
import { Award, TrendingUp, Crown } from "lucide-react";

interface Member {
    id: string;
    memberId: string;
    name: string;
    totalPoints: number;
    totalSpent: number;
    transactionCount: number;
}

interface TopMembersCardProps {
    members: Member[];
}

export default function TopMembersCard({ members }: TopMembersCardProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-dark">
            <div className="mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-brand-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Top Member dengan Point Terbanyak
                </h3>
            </div>

            <div className="space-y-3">
                {members.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Belum ada data transaksi
                    </p>
                ) : (
                    members.map((member, index) => (
                        <div
                            key={member.id}
                            className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                        >
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white">
                                {index < 3 ? (
                                    <Crown
                                        className={`h-5 w-5 ${index === 0
                                                ? "text-yellow-300"
                                                : index === 1
                                                    ? "text-gray-300"
                                                    : "text-orange-300"
                                            }`}
                                    />
                                ) : (
                                    <span className="font-bold">{index + 1}</span>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {member.name}
                                    </p>
                                    {index < 3 && (
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${index === 0
                                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                                    : index === 1
                                                        ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                        : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                                                }`}
                                        >
                                            Top {index + 1}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    ID: {member.memberId} • {member.transactionCount} transaksi
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="flex items-center gap-1 text-lg font-bold text-brand-600 dark:text-brand-400">
                                    <TrendingUp className="h-4 w-4" />
                                    {formatNumber(member.totalPoints)} pts
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatCurrency(member.totalSpent)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
