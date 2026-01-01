"use client";

import { useState } from "react";
import {
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Eye,
    Award,
    ShoppingCart,
    MessageCircle,
} from "lucide-react";
import CustomerDetailModal from "./CustomerDetailModal";
import WhatsAppButton from "../common/WhatsAppButton";

interface Customer {
    id: string;
    memberId: string;
    name: string;
    email: string | null;
    phone: string | null;
    totalPoints: number;
    totalSpent: number;
    transactionCount: number;
}

interface CustomerTableProps {
    customers: Customer[];
}

type SortField = "name" | "totalPoints" | "totalSpent" | "transactionCount";
type SortOrder = "asc" | "desc";

export default function CustomerTable({ customers }: CustomerTableProps) {
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
        null
    );

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const sortedCustomers = [...customers].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
            return sortOrder === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
            return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
    });

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) {
            return <ChevronsUpDown className="ml-1 h-4 w-4 text-gray-400" />;
        }
        return sortOrder === "asc" ? (
            <ChevronUp className="ml-1 h-4 w-4 text-brand-500" />
        ) : (
            <ChevronDown className="ml-1 h-4 w-4 text-brand-500" />
        );
    };

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-dark lg:block">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Member ID
                                </th>
                                <th
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    onClick={() => handleSort("name")}
                                >
                                    <div className="flex items-center">
                                        Nama
                                        <SortIcon field="name" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Kontak
                                </th>
                                <th
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    onClick={() => handleSort("totalPoints")}
                                >
                                    <div className="flex items-center">
                                        Total Points
                                        <SortIcon field="totalPoints" />
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    onClick={() => handleSort("totalSpent")}
                                >
                                    <div className="flex items-center">
                                        Total Belanja
                                        <SortIcon field="totalSpent" />
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    onClick={() =>
                                        handleSort("transactionCount")
                                    }
                                >
                                    <div className="flex items-center">
                                        Transaksi
                                        <SortIcon field="transactionCount" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-dark">
                            {sortedCustomers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                                    >
                                        Tidak ada data pelanggan
                                    </td>
                                </tr>
                            ) : (
                                sortedCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {customer.memberId}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                            {customer.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {customer.email && (
                                                <div className="mb-1">
                                                    {customer.email}
                                                </div>
                                            )}
                                            {customer.phone && (
                                                <div>{customer.phone}</div>
                                            )}
                                            {!customer.email &&
                                                !customer.phone && (
                                                    <span className="text-gray-400">
                                                        -
                                                    </span>
                                                )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-brand-600 dark:text-brand-400">
                                            {customer.totalPoints.toLocaleString(
                                                "id-ID"
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            Rp{" "}
                                            {customer.totalSpent.toLocaleString(
                                                "id-ID"
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {customer.transactionCount}x
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        setSelectedCustomerId(
                                                            customer.id
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:hover:bg-brand-900/40"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    Detail
                                                </button>
                                                <WhatsAppButton
                                                    phone={customer.phone}
                                                    message={`Halo ${customer.name}, kami dari tim reward ingin menyapa Anda. Anda memiliki ${customer.totalPoints} poin saat ini.`}
                                                    variant="compact"
                                                    label="WA"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 lg:hidden">
                {sortedCustomers.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-dark">
                        <p className="text-gray-500 dark:text-gray-400">
                            Tidak ada data pelanggan
                        </p>
                    </div>
                ) : (
                    sortedCustomers.map((customer) => (
                        <div
                            key={customer.id}
                            className="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-800 dark:bg-gray-dark"
                        >
                            <div className="mb-3 flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {customer.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {customer.memberId}
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        setSelectedCustomerId(customer.id)
                                    }
                                    className="rounded-lg bg-brand-50 p-2 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:hover:bg-brand-900/40"
                                >
                                    <Eye className="h-4 w-4" />
                                </button>
                            </div>

                            {(customer.email || customer.phone) && (
                                <div className="mb-3 space-y-1 text-sm">
                                    {customer.email && (
                                        <p className="text-gray-600 dark:text-gray-400">
                                            📧 {customer.email}
                                        </p>
                                    )}
                                    {customer.phone && (
                                        <p className="text-gray-600 dark:text-gray-400">
                                            📱 {customer.phone}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Points
                                    </p>
                                    <p className="flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400">
                                        <Award className="h-3 w-3" />
                                        {customer.totalPoints.toLocaleString(
                                            "id-ID"
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Belanja
                                    </p>
                                    <p className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                                        <ShoppingCart className="h-3 w-3" />
                                        Rp{" "}
                                        {(customer.totalSpent / 1000).toFixed(
                                            0
                                        )}
                                        k
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Transaksi
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {customer.transactionCount}x
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            <CustomerDetailModal
                customerId={selectedCustomerId}
                onClose={() => setSelectedCustomerId(null)}
            />
        </>
    );
}
