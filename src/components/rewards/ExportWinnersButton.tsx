"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { exportRewardWinners } from "@/app/actions/rewards";

interface ExportWinnersButtonProps {
    campaignId: string;
    campaignName: string;
}

export default function ExportWinnersButton({
    campaignId,
    campaignName,
}: ExportWinnersButtonProps) {
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            const result = await exportRewardWinners(campaignId);

            if (result.success && result.data) {
                // Create blob from CSV data
                const blob = new Blob([result.data], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);

                // Create download link
                const link = document.createElement("a");
                link.href = url;
                link.download = `${campaignName.replace(/\s+/g, "_")}_Winners_${new Date().toISOString().split("T")[0]}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Cleanup
                URL.revokeObjectURL(url);
            } else {
                alert(result.error || "Gagal mengekspor data");
            }
        } catch (error) {
            alert("Terjadi kesalahan saat mengekspor data");
        } finally {
            setExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
            {exporting ? (
                <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-700 border-t-transparent dark:border-gray-300" />
                    Mengekspor...
                </>
            ) : (
                <>
                    <Download className="h-5 w-5" />
                    Export ke CSV
                </>
            )}
        </button>
    );
}
