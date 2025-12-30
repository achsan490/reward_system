"use client";

import { TrendingUp, Users, Award, DollarSign } from "lucide-react";

interface CampaignInsightsProps {
    insights: {
        topCriteria: {
            criteria: string;
            count: number;
        } | null;
        totalMembersParticipated: number;
        averageWinnersPerCampaign: number;
        claimRate: number;
    };
}

export default function CampaignInsights({ insights }: CampaignInsightsProps) {
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

    const insightCards = [
        {
            title: "Kriteria Terpopuler",
            value: insights.topCriteria
                ? getCriteriaLabel(insights.topCriteria.criteria)
                : "N/A",
            subtitle: insights.topCriteria
                ? `${insights.topCriteria.count} campaign`
                : "Belum ada data",
            icon: TrendingUp,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
        },
        {
            title: "Member Berpartisipasi",
            value: insights.totalMembersParticipated.toLocaleString("id-ID"),
            subtitle: "Total unique members",
            icon: Users,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            title: "Rata-rata Pemenang",
            value: insights.averageWinnersPerCampaign.toFixed(1),
            subtitle: "Per campaign",
            icon: Award,
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-50 dark:bg-orange-900/20",
        },
        {
            title: "Tingkat Klaim",
            value: `${insights.claimRate.toFixed(0)}%`,
            subtitle: "Reward yang sudah diklaim",
            icon: DollarSign,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-50 dark:bg-green-900/20",
        },
    ];

    return (
        <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 dark:border-gray-800 dark:from-gray-900 dark:to-gray-900/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                📊 Campaign Insights
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {insightCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.title}
                            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        {card.title}
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                                        {card.value}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {card.subtitle}
                                    </p>
                                </div>
                                <div className={`rounded-lg p-2 ${card.bgColor}`}>
                                    <Icon className={`h-5 w-5 ${card.color}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 rounded-lg bg-brand-50 p-4 dark:bg-brand-900/10">
                <p className="text-sm text-brand-800 dark:text-brand-300">
                    {insights.topCriteria ? (
                        <>
                            💡 <strong>Tips:</strong> Campaign dengan kriteria{" "}
                            <strong>
                                {getCriteriaLabel(insights.topCriteria.criteria)}
                            </strong>{" "}
                            paling sering digunakan. Pastikan untuk mengingatkan member
                            yang belum mengklaim reward mereka!
                        </>
                    ) : (
                        <>
                            🚀 <strong>Mulai Sekarang:</strong> Belum ada campaign reward?
                            Klik tombol <strong>&quot;Buat Campaign Baru&quot;</strong> di atas untuk
                            membuat campaign pertama Anda dan otomatis tentukan pemenang
                            berdasarkan kriteria tertentu!
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
