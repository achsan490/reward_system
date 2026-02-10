"use client";

import { Eye, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { deleteRewardCampaign, updateCampaignStatus } from "@/app/actions/rewards";
import { useRouter } from "next/navigation";

interface Campaign {
    id: string;
    name: string;
    description: string | null;
    criteria: string;
    winnersCount: number;
    startDate: Date;
    endDate: Date;
    status: string;
    createdAt: Date;
}

interface RewardCampaignTableProps {
    campaigns: Campaign[];
}

export default function RewardCampaignTable({
    campaigns,
}: RewardCampaignTableProps) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus campaign ini?")) {
            return;
        }

        setDeletingId(id);
        const result = await deleteRewardCampaign(id);

        if (result.success) {
            router.refresh();
        } else {
            alert(result.error || "Gagal menghapus campaign");
        }
        setDeletingId(null);
    };

    const getCriteriaLabel = (criteria: string) => {
        switch (criteria) {
            case "top_points":
                return "Top Points";
            case "top_spending":
                return "Top Spending";
            case "top_transactions":
                return "Top Transactions";
            default:
                return criteria;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        Aktif
                    </span>
                );
            case "completed":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        <CheckCircle className="h-3 w-3" />
                        Selesai
                    </span>
                );
            case "cancelled":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        <XCircle className="h-3 w-3" />
                        Dibatalkan
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-900/20 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        {status}
                    </span>
                );
        }
    };

    if (campaigns.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
                <div className="mx-auto w-24 h-24 mb-4 text-gray-400">
                    <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Belum Ada Campaign
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Mulai dengan membuat campaign reward pertama Anda
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Campaign
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Periode
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Kriteria
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Status
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
                    {campaigns.map((campaign) => (
                        <tr
                            key={campaign.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            <td className="px-4 py-4">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {campaign.name}
                                    </p>
                                    {campaign.description && (
                                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                            {campaign.description}
                                        </p>
                                    )}
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                {new Date(campaign.startDate).toLocaleDateString(
                                    "id-ID",
                                    { day: "numeric", month: "short" }
                                )}{" "}
                                -{" "}
                                {new Date(campaign.endDate).toLocaleDateString(
                                    "id-ID",
                                    { day: "numeric", month: "short", year: "numeric" }
                                )}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white">
                                {getCriteriaLabel(campaign.criteria)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-center">
                                {getStatusBadge(campaign.status)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Link
                                        href={`/reward-determination/${campaign.id}`}
                                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                        title="Lihat Detail"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(campaign.id)}
                                        disabled={deletingId === campaign.id}
                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                        title="Hapus"
                                    >
                                        {deletingId === campaign.id ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
