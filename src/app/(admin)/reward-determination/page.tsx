import { Metadata } from "next";
import {
    getRewardCampaigns,
    getRewardStatistics,
} from "@/app/actions/rewards";
import {
    getTopMembers,
    getTransactionStats,
} from "@/app/actions/transaction";
import RewardStats from "@/components/rewards/RewardStats";
import RewardCampaignTable from "@/components/rewards/RewardCampaignTable";
import RecentWinnersCard from "@/components/rewards/RecentWinnersCard";
import CreateCampaignButton from "@/components/rewards/CreateCampaignButton";

export const metadata: Metadata = {
    title: "Penentuan Reward | Reward System",
    description: "Kelola dan tentukan pemenang reward berdasarkan data transaksi",
};

export default async function RewardDeterminationPage() {
    // Fetch data
    const [campaignsResult, rewardStatsResult, topMembersResult, transactionStatsResult] =
        await Promise.all([
            getRewardCampaigns(),
            getRewardStatistics(),
            getTopMembers(5),
            getTransactionStats(),
        ]);

    const campaigns = campaignsResult.success
        ? campaignsResult.data ?? []
        : [];

    const rewardStats =
        rewardStatsResult.success && rewardStatsResult.data
            ? rewardStatsResult.data
            : {
                totalCampaigns: 0,
                activeCampaigns: 0,
                totalWinners: 0,
                claimedRewards: 0,
            };

    const transactionStats =
        transactionStatsResult.success && transactionStatsResult.data
            ? transactionStatsResult.data
            : {
                totalTransactions: 0,
                totalMembers: 0,
                totalAmount: 0,
                totalPoints: 0,
            };

    // Extract Top 3 Points and Top Winner Name
    const topMembers = topMembersResult.success
        ? topMembersResult.data ?? []
        : [];

    const topThreePoints =
        topMembers.length > 0
            ? topMembers
                .slice(0, 3)
                .map((m) => m.totalPoints.toLocaleString("id-ID"))
                .join(" | ")
            : "Belum ada data";

    const topWinnerName =
        topMembers.length > 0 ? topMembers[0].name : "Belum ada pemenang";

    // Merge stats for the view
    const stats = {
        totalMembers: transactionStats.totalMembers,
        totalPoints: transactionStats.totalPoints,
        topThreePoints: topThreePoints,
        topWinnerName: topWinnerName,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Penentuan Reward
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Kelola campaign reward dan tentukan pemenang berdasarkan
                        kriteria tertentu
                    </p>
                </div>
                <CreateCampaignButton />
            </div>

            {/* Statistics */}
            <RewardStats stats={stats} />

            {/* Recent Top Members Preview */}
            <RecentWinnersCard members={topMembers} />

            {/* Campaigns Table */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Daftar Campaign Reward
                </h2>
                <RewardCampaignTable campaigns={campaigns} />
            </div>
        </div>
    );
}
