"use client";

import { useState } from "react";
import { Edit2, Trash2, ToggleLeft, ToggleRight, Package } from "lucide-react";
import { updateRewardCatalog, deleteRewardCatalog } from "@/app/actions/reward-catalog";

interface RewardCatalogTableProps {
    catalogs: any[];
    onEdit: (catalog: any) => void;
    onRefresh: () => void;
}

export default function RewardCatalogTable({
    catalogs,
    onEdit,
    onRefresh,
}: RewardCatalogTableProps) {
    const [processing, setProcessing] = useState<string | null>(null);

    const handleToggleActive = async (catalog: any) => {
        setProcessing(catalog.id);
        const result = await updateRewardCatalog(catalog.id, {
            isActive: !catalog.isActive,
        });
        setProcessing(null);

        if (result.success) {
            onRefresh();
        } else {
            alert(result.error);
        }
    };

    const handleDelete = async (catalog: any) => {
        if (
            !confirm(
                `Hapus reward "${catalog.name}"?\n\nHanya bisa dihapus jika belum ada yang menukar reward ini.`
            )
        ) {
            return;
        }

        setProcessing(catalog.id);
        const result = await deleteRewardCatalog(catalog.id);
        setProcessing(null);

        if (result.success) {
            onRefresh();
        } else {
            alert(result.error);
        }
    };

    const formatStock = (stock: number | null) => {
        if (stock === null) return "Unlimited";
        return stock.toLocaleString("id-ID");
    };

    const isExpired = (validUntil: Date | null) => {
        if (!validUntil) return false;
        return new Date(validUntil) < new Date();
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Reward
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Points
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Stock
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Redeemed
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Status
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
                    {catalogs.length === 0 ? (
                        <tr>
                            <td
                                colSpan={7}
                                className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                            >
                                Belum ada reward. Klik "Tambah Reward" untuk membuat reward pertama.
                            </td>
                        </tr>
                    ) : (
                        catalogs.map((catalog) => (
                            <tr
                                key={catalog.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <td className="px-4 py-3">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {catalog.name}
                                        </p>
                                        {catalog.description && (
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                                {catalog.description}
                                            </p>
                                        )}
                                        {isExpired(catalog.validUntil) && (
                                            <span className="mt-1 inline-block text-xs text-red-600 dark:text-red-400">
                                                Expired
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    {catalog.category ? (
                                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                            {catalog.category}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-brand-600 dark:text-brand-400">
                                    {catalog.pointsRequired.toLocaleString("id-ID")} pts
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    <div className="flex items-center gap-1">
                                        <Package className="h-4 w-4 text-gray-400" />
                                        {formatStock(catalog.stock)}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    {catalog._count?.redemptions || 0}x
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    {catalog.isActive ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400">
                                            <ToggleRight className="h-3 w-3" />
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                            <ToggleLeft className="h-3 w-3" />
                                            Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleToggleActive(catalog)}
                                            disabled={processing === catalog.id}
                                            className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                                            title={catalog.isActive ? "Deactivate" : "Activate"}
                                        >
                                            {catalog.isActive ? (
                                                <ToggleLeft className="h-4 w-4" />
                                            ) : (
                                                <ToggleRight className="h-4 w-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => onEdit(catalog)}
                                            disabled={processing === catalog.id}
                                            className="rounded p-1 text-blue-600 hover:bg-blue-50 disabled:opacity-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                            title="Edit"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(catalog)}
                                            disabled={processing === catalog.id}
                                            className="rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
