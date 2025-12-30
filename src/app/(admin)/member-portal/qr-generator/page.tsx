import { Metadata } from "next";
import QRGeneratorContent from "@/components/member-portal/QRGeneratorContent";

export const metadata: Metadata = {
    title: "QR Code Generator | Reward System",
    description: "Generate QR code untuk member",
};

export default function QRGeneratorPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    📱 QR Code Generator
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Generate QR code untuk member cek poin
                </p>
            </div>

            <QRGeneratorContent />
        </div>
    );
}
