import { Metadata } from "next";
import RewardCatalogContent from "@/components/rewards/RewardCatalogContent";

export const metadata: Metadata = {
    title: "Reward Catalog | Reward System",
    description: "Kelola katalog reward yang bisa ditukar member",
};

export default function RewardCatalogPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    🎁 Reward Catalog
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Kelola katalog reward yang bisa ditukar dengan poin
                </p>
            </div>

            <RewardCatalogContent />
        </div>
    );
}
