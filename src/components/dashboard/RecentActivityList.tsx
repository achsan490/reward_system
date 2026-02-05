"use client";

import { CheckCircle2, DollarSign, Trophy } from "lucide-react";

interface Activity {
    id: string;
    type: "transaction" | "reward";
    title: string;
    description: string;
    date: Date;
    amount: number;
}

interface RecentActivityListProps {
    activities: Activity[];
}

export default function RecentActivityList({ activities }: RecentActivityListProps) {
    if (activities.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Aktivitas Terbaru
                </h3>
                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Belum ada aktivitas terbaru.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Aktivitas Terbaru
            </h3>
            <div className="flex flex-col gap-4">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50/50 p-3 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                        {/* Icon */}
                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${activity.type === "transaction"
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}>
                            {activity.type === "transaction" ? (
                                <DollarSign className="h-5 w-5" />
                            ) : (
                                <Trophy className="h-5 w-5" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                {activity.title}
                            </p>
                            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                {activity.description}
                            </p>
                        </div>

                        {/* Date & Amount */}
                        <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {activity.type === "transaction" ? "+" : ""}
                                {activity.amount > 0 ? activity.amount.toLocaleString("id-ID") : ""}
                                {activity.type === "transaction" ? "" : " Poin"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(activity.date).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
