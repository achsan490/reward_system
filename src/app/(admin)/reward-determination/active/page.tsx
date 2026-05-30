import { Metadata } from "next";
import { getRewardCampaigns } from "@/app/actions/rewards";
import RewardCampaignTable from "@/components/rewards/RewardCampaignTable";
import CreateCampaignButton from "@/components/rewards/CreateCampaignButton";

export const metadata: Metadata = {
    title: "Reward Period | Reward System",
    description: "Kelola periode reward dan tentukan pemenang",
};

export const dynamic = "force-dynamic";

export default async function ActiveCampaignPage() {
    // Only fetch campaigns
    const campaignsResult = await getRewardCampaigns();

    const campaigns = campaignsResult.success
        ? campaignsResult.data ?? []
        : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Reward Periods
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Kelola periode reward dan tentukan pemenang berdasarkan
                        kriteria tertentu
                    </p>
                </div>
                <CreateCampaignButton />
            </div>

            {/* Campaigns Table */}
            <div>
                <RewardCampaignTable campaigns={campaigns} />
            </div>
        </div>
    );
}
