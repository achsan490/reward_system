"use client";

import { Crown, Upload, Users, Settings } from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
    const actions = [
        {
            title: "Upload Transaksi",
            href: "/transactions",
            icon: Upload,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
            title: "Data Member",
            href: "/transactions", // Redirects to transactions which has top members
            icon: Users,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-900/20",
        },
        {
            title: "Penentuan Reward",
            href: "/reward-determination",
            icon: Crown,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
        },
        {
            title: "Pengaturan Sistem",
            href: "/settings",
            icon: Settings,
            color: "text-gray-600 dark:text-gray-400",
            bgColor: "bg-gray-100 dark:bg-gray-800",
        },
    ];

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Akses Cepat
            </h3>
            <div className="grid grid-cols-2 gap-4">
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={index}
                            href={action.href}
                            className="flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-4 text-center transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                            <div className={`mb-3 rounded-full p-2 ${action.bgColor}`}>
                                <Icon className={`h-6 w-6 ${action.color}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {action.title}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
