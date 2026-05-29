"use client";

import { AlertCircle, TrendingDown, Users, DollarSign } from "lucide-react";
import { formatDateShortID, getDaysUntilExpiry } from "@/lib/expirationUtils";
import WhatsAppButton from "../common/WhatsAppButton";

interface ExpirationReportData {
    summary: {
        totalExpired: number;
        totalExpiringSoon: number;
        affectedMembers: number;
        totalValueLost: number;
    };
    timeline: Array<{ month: string; expired: number; expiring: number }>;
    memberList: Array<{
        member: {
            id: string;
            memberId: string;
            name: string;
            phone: string | null;
            email: string | null;
        };
        expiringPoints: number;
        earliestExpiryDate: Date | null;
        transactionCount: number;
    }>;
}

export default function ExpirationReportContent({ data }: { data: ExpirationReportData }) {
    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Poin Tiket Hangus
                            </p>
                            <h3 className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
                                {data.summary.totalExpired.toLocaleString("id-ID")}
                            </h3>
                        </div>
                        <div className="rounded-xl bg-red-100 p-3 dark:bg-red-900/20">
                            <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Tiket Akan Kadaluarsa (30 hari)
                            </p>
                            <h3 className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {data.summary.totalExpiringSoon.toLocaleString("id-ID")}
                            </h3>
                        </div>
                        <div className="rounded-xl bg-yellow-100 p-3 dark:bg-yellow-900/20">
                            <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Member Terdampak
                            </p>
                            <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                {data.summary.affectedMembers.toLocaleString("id-ID")}
                            </h3>
                        </div>
                        <div className="rounded-xl bg-gray-100 p-3 dark:bg-gray-800">
                            <Users className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Total Poin Hangus
                            </p>
                            <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                {data.summary.totalValueLost.toLocaleString("id-ID")}
                            </h3>
                        </div>
                        <div className="rounded-xl bg-purple-100 p-3 dark:bg-purple-900/20">
                            <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Member List */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Tiket Kadaluarsa
                </h3>

                {data.memberList.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        Tidak ada tiket penukaran yang hampir kadaluarsa dalam 30 hari ke depan
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Member
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Poin Terikat
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Tanggal Kadaluarsa
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Sisa Hari
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
                                {data.memberList.map((item) => {
                                    const daysRemaining = item.earliestExpiryDate
                                        ? getDaysUntilExpiry(item.earliestExpiryDate)
                                        : 0;
                                    const isUrgent = daysRemaining <= 7;

                                    return (
                                        <tr
                                            key={item.member.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {item.member.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {item.member.memberId}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-red-600 dark:text-red-400">
                                                {item.expiringPoints.toLocaleString("id-ID")} pts
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                {formatDateShortID(item.earliestExpiryDate)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium${isUrgent
                                                            ? " bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                                                            : " bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                                                        }`}
                                                >
                                                    {daysRemaining} hari
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <WhatsAppButton
                                                    phone={item.member.phone}
                                                    message={`Halo ${item.member.name}, kami ingin mengingatkan bahwa tiket penukaran reward Anda dengan total nilai ${item.expiringPoints} poin akan segera kadaluarsa pada ${formatDateShortID(item.earliestExpiryDate)}. Yuk segera diambil di toko sebelum hangus!`}
                                                    variant="compact"
                                                    label="Kirim WA"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
