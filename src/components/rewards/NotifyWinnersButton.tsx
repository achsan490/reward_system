"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { notifyWinners } from "@/app/actions/rewards";

interface NotifyWinnersButtonProps {
    campaignId: string;
    campaignName: string;
    winnersCount: number;
}

export default function NotifyWinnersButton({
    campaignId,
    campaignName,
    winnersCount,
}: NotifyWinnersButtonProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");

    const handleNotify = async () => {
        if (winnersCount === 0) {
            setMessage("Tidak ada pemenang untuk dikirim notifikasi");
            setMessageType("error");
            return;
        }

        if (
            !confirm(
                `Generate WhatsApp notification untuk ${winnersCount} pemenang campaign "${campaignName}"?\n\nLink WhatsApp akan dibuka di tab baru untuk setiap pemenang.`
            )
        ) {
            return;
        }

        setLoading(true);
        setMessage("");
        setMessageType("");

        try {
            const result = await notifyWinners(campaignId);

            if (result.success && result.results) {
                // Open WhatsApp for each winner
                let openedCount = 0;

                for (const winner of result.results) {
                    if (winner.success && winner.url) {
                        // Open in new tab with slight delay to prevent popup blocker
                        setTimeout(() => {
                            window.open(winner.url!, '_blank');
                        }, openedCount * 500); // 500ms delay between each
                        openedCount++;
                    }
                }

                setMessage(
                    `✅ ${result.message}. WhatsApp akan terbuka di ${openedCount} tab baru.`
                );
                setMessageType("success");
            } else {
                setMessage(result.error || "Gagal generate WhatsApp notification");
                setMessageType("error");
            }
        } catch (error) {
            setMessage("Terjadi kesalahan saat generate WhatsApp notification");
            setMessageType("error");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <button
                onClick={handleNotify}
                disabled={loading || winnersCount === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-600"
                title={winnersCount === 0 ? "Tidak ada pemenang" : "Kirim notifikasi WhatsApp ke semua pemenang"}
            >
                <MessageCircle className="h-4 w-4" />
                {loading ? "Generating..." : `📱 Notifikasi ${winnersCount} Pemenang`}
            </button>

            {message && (
                <div
                    className={`rounded-lg p-3 text-sm ${messageType === "success"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                >
                    {message}
                </div>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 Tip: WhatsApp akan terbuka di tab baru untuk setiap pemenang
            </p>
        </div>
    );
}
