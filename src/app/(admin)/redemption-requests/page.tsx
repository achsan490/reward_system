import { Metadata } from "next";
import RedemptionRequestsContent from "@/components/rewards/RedemptionRequestsContent";

export const metadata: Metadata = {
    title: "Redemption Requests | Reward System",
    description: "Kelola permintaan penukaran reward dari member",
};

export default function RedemptionRequestsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    📋 Redemption Requests
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Kelola permintaan penukaran reward dari member
                </p>
            </div>

            <RedemptionRequestsContent />
        </div>
    );
}
