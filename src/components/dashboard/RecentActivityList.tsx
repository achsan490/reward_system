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
            <div className="flow-root">
                <ul role="list" className="-mb-8">
                    {activities.map((activity, activityIdx) => (
                        <li key={activity.id}>
                            <div className="relative pb-8">
                                {activityIdx !== activities.length - 1 ? (
                                    <span
                                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-800"
                                        aria-hidden="true"
                                    />
                                ) : null}
                                <div className="relative flex space-x-3">
                                    <>
                                        {activity.type === "transaction" ? (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 ring-8 ring-white dark:bg-green-900/30 dark:ring-gray-900">
                                                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            </div>
                                        ) : (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 ring-8 ring-white dark:bg-yellow-900/30 dark:ring-gray-900">
                                                <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                            </div>
                                        )}
                                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {activity.title}
                                                    </span>{" "}
                                                    - {activity.description}
                                                </p>
                                            </div>
                                            <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                                                <time dateTime={activity.date.toString()}>
                                                    {new Date(activity.date).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                    })}
                                                </time>
                                            </div>
                                        </div>
                                    </>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
