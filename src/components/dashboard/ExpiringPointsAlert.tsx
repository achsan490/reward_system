"use client";

import { AlertTriangle, X, Users } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface ExpiringPointsAlertProps {
    pointsExpiringSoon: number;
    membersWithExpiringPoints: number;
}

export default function ExpiringPointsAlert({
    pointsExpiringSoon,
    membersWithExpiringPoints,
}: ExpiringPointsAlertProps) {
    const [dismissed, setDismissed] = useState(false);

    // Don't show if no expiring points or if dismissed
    if (pointsExpiringSoon === 0 || dismissed) {
        return null;
    }

    // Determine urgency level
    const isUrgent = membersWithExpiringPoints >= 10;

    return (
        <div
            className={`relative rounded-lg border-2 p-4 ${isUrgent
                    ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                    : "border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"
                }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`rounded-lg p-2 ${isUrgent
                            ? "bg-red-100 dark:bg-red-900/40"
                            : "bg-yellow-100 dark:bg-yellow-900/40"
                        }`}
                >
                    <AlertTriangle
                        className={`h-5 w-5 ${isUrgent
                                ? "text-red-600 dark:text-red-400"
                                : "text-yellow-600 dark:text-yellow-400"
                            }`}
                    />
                </div>

                <div className="flex-1">
                    <h3
                        className={`font-semibold ${isUrgent
                                ? "text-red-900 dark:text-red-300"
                                : "text-yellow-900 dark:text-yellow-300"
                            }`}
                    >
                        {isUrgent ? "⚠️ Peringatan Urgent!" : "📢 Peringatan Tiket Kadaluarsa"}
                    </h3>
                    <p
                        className={`mt-1 text-sm ${isUrgent
                                ? "text-red-800 dark:text-red-400"
                                : "text-yellow-800 dark:text-yellow-400"
                            }`}
                    >
                        <span className="font-semibold">
                            {membersWithExpiringPoints} member
                        </span>{" "}
                        memiliki{" "}
                        <span className="font-semibold">
                            {pointsExpiringSoon.toLocaleString("id-ID")} poin
                        </span>{" "}
                        pada tiket penukaran mereka yang akan kadaluarsa dalam 30 hari ke depan.
                    </p>
                    <p
                        className={`mt-2 text-sm ${isUrgent
                                ? "text-red-700 dark:text-red-400"
                                : "text-yellow-700 dark:text-yellow-400"
                            }`}
                    >
                        Segera hubungi member untuk mengingatkan mereka agar mengambil reward di toko sebelum tiket kadaluarsa!
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <Link
                            href="/reports/expiration"
                            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${isUrgent
                                    ? "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                                    : "bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600"
                                }`}
                        >
                            <Users className="h-4 w-4" />
                            Lihat Laporan Tiket
                        </Link>
                    </div>
                </div>

                <button
                    onClick={() => setDismissed(true)}
                    className={`rounded-lg p-1 transition-colors ${isUrgent
                            ? "text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40"
                            : "text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900/40"
                        }`}
                    aria-label="Dismiss alert"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
