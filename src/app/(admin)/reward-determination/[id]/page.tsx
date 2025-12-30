import { Metadata } from "next";
import { getRewardCampaignById } from "@/app/actions/rewards";
import WinnersTable from "@/components/rewards/WinnersTable";
import ExportWinnersButton from "@/components/rewards/ExportWinnersButton";
import Link from "next/link";
import { ArrowLeft, Calendar, Award, Users, CheckCircle } from "lucide-react";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Detail Campaign | Reward System",
    description: "Lihat detail campaign reward dan daftar pemenang",
};

interface CampaignDetailPageProps {
    params: {
        id: string;
    };
}

export default async function CampaignDetailPage({
    params,
}: CampaignDetailPageProps) {
    const result = await getRewardCampaignById(params.id);

    if (!result.success || !result.data) {
        notFound();
    }

    const campaign = result.data;
    const claimedCount = campaign.rewards.filter((r) => r.rewardClaimed).length;

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
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        Aktif
                    </span>
                );
            case "completed":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        <CheckCircle className="h-4 w-4" />
                        Selesai
                    </span>
                );
            case "cancelled":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        Dibatalkan
                    </span>
                );
            default:
                return (
                    <span className="rounded-full bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600 dark:bg-gray-900/20 dark:text-gray-400">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/reward-determination"
                    className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Daftar Campaign
                </Link>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {campaign.name}
                            </h1>
                            {getStatusBadge(campaign.status)}
                        </div>
                        {campaign.description && (
                            <p className="text-gray-600 dark:text-gray-400">
                                {campaign.description}
                            </p>
                        )}
                    </div>

                    <ExportWinnersButton
                        campaignId={campaign.id}
                        campaignName={campaign.name}
                    />
                </div>
            </div>

            {/* Campaign Info Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-blue-50 p-3 dark:bg-blue-900/20">
                            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Periode
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                {new Date(campaign.startDate).toLocaleDateString(
                                    "id-ID",
                                    {
                                        day: "numeric",
                                        month: "short",
                                    }
                                )}{" "}
                                -{" "}
                                {new Date(campaign.endDate).toLocaleDateString(
                                    "id-ID",
                                    {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-purple-50 p-3 dark:bg-purple-900/20">
                            <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Kriteria
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                {getCriteriaLabel(campaign.criteria)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-green-50 p-3 dark:bg-green-900/20">
                            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Jumlah Pemenang
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                {campaign.rewards.length} /{" "}
                                {campaign.winnersCount} Pemenang
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-orange-50 p-3 dark:bg-orange-900/20">
                            <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Reward Diklaim
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                {claimedCount} / {campaign.rewards.length} Diklaim
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Winners List */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Daftar Pemenang
                </h2>
                <WinnersTable
                    winners={campaign.rewards}
                    criteria={campaign.criteria}
                />
            </div>
        </div>
    );
}
