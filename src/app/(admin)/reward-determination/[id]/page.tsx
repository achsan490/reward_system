import { Metadata } from "next";
import { getRewardCampaignById } from "@/app/actions/rewards";
import { notFound } from "next/navigation";
import CampaignDetailView from "@/components/rewards/CampaignDetailView";

export const metadata: Metadata = {
    title: "Detail Campaign | Reward System",
    description: "Lihat detail campaign reward dan daftar pemenang",
};

interface CampaignDetailPageProps {
    params: {
        id: string;
    };
}

export const dynamic = "force-dynamic";

export default async function CampaignDetailPage({
    params,
}: CampaignDetailPageProps) {
    // Next.js 15+ requires awaiting params
    const { id } = await params;
    const result = await getRewardCampaignById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const campaign = result.data;
    return <CampaignDetailView campaign={campaign} />;
}
