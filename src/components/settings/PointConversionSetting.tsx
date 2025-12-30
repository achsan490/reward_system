"use client";

import { useState } from "react";
import {
    updatePointConversionRate,
    getPointConversionRate,
} from "@/app/actions/settings";
import { recalculateAllPoints } from "@/app/actions/transaction";
import { Settings, RefreshCw, Save } from "lucide-react";

interface PointConversionSettingProps {
    initialRate: number;
}

export default function PointConversionSetting({
    initialRate,
}: PointConversionSettingProps) {
    const [rate, setRate] = useState(initialRate);
    const [saving, setSaving] = useState(false);
    const [recalculating, setRecalculating] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const handleSave = async () => {
        if (rate <= 0) {
            setMessage({ type: "error", text: "Rate harus lebih dari 0" });
            return;
        }

        setSaving(true);
        setMessage(null);

        const result = await updatePointConversionRate(rate);

        setSaving(false);

        if (result.success) {
            setMessage({
                type: "success",
                text: "Rate berhasil diupdate! Klik 'Recalculate' untuk menerapkan ke semua transaksi.",
            });
        } else {
            setMessage({ type: "error", text: result.error || "Gagal update rate" });
        }
    };

    const handleRecalculate = async () => {
        if (
            !confirm(
                "Apakah Anda yakin ingin recalculate semua point? Ini akan memperbarui semua point berdasarkan rate baru."
            )
        ) {
            return;
        }

        setRecalculating(true);
        setMessage(null);

        const result = await recalculateAllPoints();

        setRecalculating(false);

        if (result.success) {
            setMessage({
                type: "success",
                text: result.message || "Point berhasil di-recalculate!",
            });
            // Refresh page to show updated data
            window.location.reload();
        } else {
            setMessage({
                type: "error",
                text: result.error || "Gagal recalculate point",
            });
        }
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-dark">
            <div className="mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-brand-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Point Conversion Rate
                </h3>
            </div>

            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                Atur berapa rupiah yang diperlukan untuk mendapatkan 1 point reward.
            </p>

            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Jumlah Belanja (Rp) untuk 1 Point
                    </label>
                    <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-600"
                        min="1"
                        step="100"
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Contoh: Rp {rate.toLocaleString("id-ID")} = 1 point
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving || rate === initialRate}
                        className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
                    >
                        <Save className="h-4 w-4" />
                        {saving ? "Menyimpan..." : "Simpan Rate"}
                    </button>

                    <button
                        onClick={handleRecalculate}
                        disabled={recalculating}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${recalculating ? "animate-spin" : ""}`}
                        />
                        {recalculating ? "Recalculating..." : "Recalculate All Points"}
                    </button>
                </div>

                {message && (
                    <div
                        className={`rounded-lg p-4 ${message.type === "success"
                                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            }`}
                    >
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}

                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-400">
                        <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Informasi Penting
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                        <li>• Rate yang baru hanya akan berlaku untuk transaksi baru</li>
                        <li>
                            • Gunakan tombol "Recalculate" untuk menerapkan rate baru ke semua
                            transaksi yang sudah ada
                        </li>
                        <li>• Proses recalculate mungkin memakan waktu beberapa saat</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
