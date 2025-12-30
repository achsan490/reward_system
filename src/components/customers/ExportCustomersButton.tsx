"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { exportCustomersToCSV } from "@/app/actions/customers";

export default function ExportCustomersButton() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);

        try {
            const result = await exportCustomersToCSV();

            if (result.success && result.data) {
                // Create blob and download
                const blob = new Blob([result.data], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `data-pelanggan-${new Date().toISOString().split("T")[0]}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                alert(result.error || "Gagal export data");
            }
        } catch (error) {
            console.error("Export error:", error);
            alert("Terjadi kesalahan saat export data");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export CSV"}
        </button>
    );
}
