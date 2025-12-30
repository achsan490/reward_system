"use client";

import { formatCurrency, formatNumber } from "@/lib/pointCalculator";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Transaction {
    id: string;
    transactionDate: Date;
    amount: number;
    pointsEarned: number;
    description: string | null;
    member: {
        memberId: string;
        name: string;
    };
}

interface TransactionTableProps {
    transactions: Transaction[];
}

export default function TransactionTable({
    transactions,
}: TransactionTableProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-dark">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                Member
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                Tanggal
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                Jumlah Belanja
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                Point Earned
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                Deskripsi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {transactions.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                                >
                                    Belum ada transaksi. Upload file CSV untuk menambahkan data.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((txn) => (
                                <tr
                                    key={txn.id}
                                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {txn.member.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                ID: {txn.member.memberId}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {format(new Date(txn.transactionDate), "dd MMM yyyy", {
                                            locale: id,
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(txn.amount)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
                                            +{formatNumber(txn.pointsEarned)} pts
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {txn.description || "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
