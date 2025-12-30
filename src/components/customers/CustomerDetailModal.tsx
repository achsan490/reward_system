"use client";

import { X, User, Mail, Phone, Calendar, Receipt, AlertTriangle, MessageCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getCustomerById } from "@/app/actions/customers";
import { getMemberExpiringPoints } from "@/app/actions/point-expiration";
import {
    getDaysUntilExpiry,
    formatExpiryWarning,
    getUrgencyLevel,
    formatDateShortID,
} from "@/lib/expirationUtils";
import { createWhatsAppUrl } from "@/lib/phoneUtils";

interface Transaction {
    id: string;
    transactionDate: Date;
    amount: number;
    pointsEarned: number;
    pointsExpiryDate: Date | null;
    pointsExpired: boolean;
    description: string | null;
}

interface CustomerDetail {
    id: string;
    memberId: string;
    name: string;
    email: string | null;
    phone: string | null;
    totalPoints: number;
    totalSpent: number;
    transactionCount: number;
    createdAt: Date;
    transactions: Transaction[];
}

interface ExpiringPointsData {
    transactions: Transaction[];
    totalExpiringPoints: number;
    earliestExpiryDate: Date | null;
}

interface CustomerDetailModalProps {
    customerId: string | null;
    onClose: () => void;
}

export default function CustomerDetailModal({
    customerId,
    onClose,
}: CustomerDetailModalProps) {
    const [customer, setCustomer] = useState<CustomerDetail | null>(null);
    const [expiringPoints, setExpiringPoints] = useState<ExpiringPointsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (customerId) {
            setLoading(true);
            Promise.all([
                getCustomerById(customerId),
                getMemberExpiringPoints(customerId),
            ]).then(([customerResult, expiringResult]) => {
                if (customerResult.success && customerResult.data) {
                    setCustomer(customerResult.data as CustomerDetail);
                }
                if (expiringResult.success && expiringResult.data) {
                    setExpiringPoints(expiringResult.data as ExpiringPointsData);
                }
                setLoading(false);
            });
        }
    }, [customerId]);

    if (!customerId) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only close if clicking the backdrop itself, not the modal content
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 pt-8"
            onClick={handleBackdropClick}
        >
            <div
                className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl dark:bg-gray-900"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Detail Pelanggan
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
                        </div>
                    ) : customer ? (
                        <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
                                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        <User className="h-4 w-4" />
                                        Informasi Pelanggan
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Member ID
                                            </p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {customer.memberId}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Nama
                                            </p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {customer.name}
                                            </p>
                                        </div>
                                        {customer.email && (
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Email
                                                </p>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {customer.email}
                                                </p>
                                            </div>
                                        )}
                                        {customer.phone && (
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Telepon
                                                </p>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {customer.phone}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Bergabung
                                            </p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {new Date(
                                                    customer.createdAt
                                                ).toLocaleDateString("id-ID", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
                                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        <Receipt className="h-4 w-4" />
                                        Statistik
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Total Points
                                            </p>
                                            <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                                                {customer.totalPoints.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Total Belanja
                                            </p>
                                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                                Rp{" "}
                                                {customer.totalSpent.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Jumlah Transaksi
                                            </p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {customer.transactionCount}x
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expiring Points Warning */}
                            {expiringPoints && expiringPoints.totalExpiringPoints > 0 && (
                                <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/40">
                                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-red-900 dark:text-red-300">
                                                ⚠️ Peringatan Poin Kadaluarsa
                                            </h4>
                                            <p className="mt-1 text-sm text-red-800 dark:text-red-400">
                                                <span className="font-semibold">
                                                    {expiringPoints.totalExpiringPoints.toLocaleString("id-ID")} poin
                                                </span>{" "}
                                                akan kadaluarsa pada{" "}
                                                <span className="font-semibold">
                                                    {formatDateShortID(expiringPoints.earliestExpiryDate)}
                                                </span>
                                                {expiringPoints.earliestExpiryDate && (
                                                    <span className="ml-1">
                                                        ({formatExpiryWarning(getDaysUntilExpiry(expiringPoints.earliestExpiryDate))})
                                                    </span>
                                                )}
                                            </p>

                                            {/* WhatsApp Button */}
                                            {customer.phone && (() => {
                                                const message = `Halo ${customer.name},\n\nKami ingin mengingatkan bahwa Anda memiliki ${expiringPoints.totalExpiringPoints} poin reward yang akan kadaluarsa pada ${formatDateShortID(expiringPoints.earliestExpiryDate)}.\n\nSegera tukarkan poin Anda sebelum hangus!\n\nTerima kasih.`;
                                                const whatsappUrl = createWhatsAppUrl(customer.phone, message);

                                                return whatsappUrl ? (
                                                    <div className="mt-3 space-y-2">
                                                        <a
                                                            href={whatsappUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                            Hubungi via WhatsApp
                                                        </a>
                                                        <p className="text-xs text-red-700 dark:text-red-400">
                                                            Klik tombol di atas untuk mengirim pesan pengingat otomatis
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="mt-2 text-xs text-red-700 dark:text-red-400">
                                                        ℹ️ Format nomor WhatsApp tidak valid. Silakan perbaiki nomor telepon.
                                                    </p>
                                                );
                                            })()}

                                            {!customer.phone && (
                                                <p className="mt-2 text-xs text-red-700 dark:text-red-400">
                                                    ℹ️ Nomor WhatsApp belum terdaftar. Tambahkan nomor untuk mengirim peringatan otomatis.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Transaction History */}
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                    Riwayat Transaksi (50 Terakhir)
                                </h3>
                                {customer.transactions.length === 0 ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400">
                                        Belum ada transaksi
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        Tanggal
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        Jumlah Belanja
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        Points
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        Kadaluarsa
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        Deskripsi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
                                                {customer.transactions.map(
                                                    (transaction) => {
                                                        const daysRemaining = transaction.pointsExpiryDate
                                                            ? getDaysUntilExpiry(transaction.pointsExpiryDate)
                                                            : Infinity;
                                                        const urgency = getUrgencyLevel(daysRemaining);

                                                        return (
                                                            <tr
                                                                key={transaction.id}
                                                                className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                                            >
                                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                                    {new Date(
                                                                        transaction.transactionDate
                                                                    ).toLocaleDateString(
                                                                        "id-ID",
                                                                        {
                                                                            year: "numeric",
                                                                            month: "short",
                                                                            day: "numeric",
                                                                        }
                                                                    )}
                                                                </td>
                                                                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                                    Rp{" "}
                                                                    {transaction.amount.toLocaleString(
                                                                        "id-ID"
                                                                    )}
                                                                </td>
                                                                <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-brand-600 dark:text-brand-400">
                                                                    {transaction.pointsEarned.toLocaleString(
                                                                        "id-ID"
                                                                    )}
                                                                </td>
                                                                <td className="whitespace-nowrap px-4 py-3 text-sm">
                                                                    {transaction.pointsExpired ? (
                                                                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                                            <Clock className="h-3 w-3" />
                                                                            Sudah Hangus
                                                                        </span>
                                                                    ) : transaction.pointsExpiryDate ? (
                                                                        <span
                                                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${urgency === "critical"
                                                                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                                                                                : urgency === "warning"
                                                                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                                                                                    : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                                                                                }`}
                                                                        >
                                                                            <Clock className="h-3 w-3" />
                                                                            {formatDateShortID(transaction.pointsExpiryDate)}
                                                                            {daysRemaining <= 30 && (
                                                                                <span className="ml-1">
                                                                                    ({daysRemaining} hari)
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-gray-500 dark:text-gray-400">
                                                                            -
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                                    {transaction.description ||
                                                                        "-"}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            Data pelanggan tidak ditemukan
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
