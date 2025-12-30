import { Metadata } from "next";
import MemberCardsContent from "@/components/member-portal/MemberCardsContent";

export const metadata: Metadata = {
    title: "Member Cards | Reward System",
    description: "Generate kartu member digital",
};

export default function MemberCardsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    💳 Member Cards
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Generate kartu member digital dengan QR code
                </p>
            </div>

            <MemberCardsContent />
        </div>
    );
}
