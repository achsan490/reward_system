"use client";

import { useState } from "react";
import {
    updatePointExpirationSettings,
    getPointExpirationSettings,
    applyExpirationToTransactions,
} from "@/app/actions/point-expiration";
import { Calendar, AlertTriangle, Save, RefreshCw } from "lucide-react";

interface PointExpirationSettingProps {
    initialEnabled: boolean;
    initialDays: number;
}

export default function PointExpirationSetting({
    initialEnabled,
    initialDays,
}: PointExpirationSettingProps) {
    const [enabled, setEnabled] = useState(initialEnabled);
    const [days, setDays] = useState(initialDays);
    const [saving, setSaving] = useState(false);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const handleSave = async () => {
        if (days <= 0) {
            setMessage({ type: "error", text: "Jumlah hari harus lebih dari 0" });
            return;
        }

        setSaving(true);
        setMessage(null);

        const result = await updatePointExpirationSettings(enabled, days);

        setSaving(false);

        if (result.success) {
            setMessage({
                type: "success",
                text: "Pengaturan berhasil diupdate! Klik 'Terapkan ke Transaksi' untuk menerapkan ke data yang sudah ada.",
            });
        } else {
            setMessage({ type: "error", text: result.error || "Gagal update pengaturan" });
        }
    };

    const handleApply = async () => {
        if (
            !confirm(
                "Apakah Anda yakin ingin menerapkan tanggal kadaluarsa ke semua transaksi yang ada? Ini akan menghitung ulang tanggal kadaluarsa berdasarkan pengaturan baru."
            )
        ) {
            return;
        }

        setApplying(true);
        setMessage(null);

        const result = await applyExpirationToTransactions();

        setApplying(false);

        if (result.success) {
            setMessage({
                type: "success",
                text: result.message || "Tanggal kadaluarsa berhasil diterapkan!",
            });
            // Refresh page to show updated data
            window.location.reload();
        } else {
            setMessage({
                type: "error",
                text: result.error || "Gagal menerapkan tanggal kadaluarsa",
            });
        }
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-dark">
            <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Kadaluarsa Poin
                </h3>
            </div>

            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                Atur berapa lama poin reward berlaku sebelum kadaluarsa. Poin yang
                kadaluarsa akan otomatis hangus.
            </p>

            <div className="space-y-4">
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Aktifkan Kadaluarsa Poin
                        </label>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Poin akan otomatis hangus setelah periode tertentu
                        </p>
                    </div>
                    <button
                        onClick={() => setEnabled(!enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled
                                ? "bg-brand-600 dark:bg-brand-500"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>

                {/* Days Input */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Periode Kadaluarsa (Hari)
                    </label>
                    <input
                        type="number"
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        disabled={!enabled}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900 dark:focus:border-brand-600"
                        min="1"
                        step="1"
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Contoh: Poin dari transaksi 1 Jan akan kadaluarsa pada{" "}
                        {new Date(
                            new Date().setDate(new Date().getDate() + days)
                        ).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}{" "}
                        ({days} hari dari sekarang)
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
                    >
                        <Save className="h-4 w-4" />
                        {saving ? "Menyimpan..." : "Simpan Pengaturan"}
                    </button>

                    <button
                        onClick={handleApply}
                        disabled={applying || !enabled}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${applying ? "animate-spin" : ""}`}
                        />
                        {applying
                            ? "Menerapkan..."
                            : "Terapkan ke Transaksi Lama"}
                    </button>
                </div>

                {/* Message */}
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

                {/* Warning Info */}
                <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-yellow-900 dark:text-yellow-400">
                        <AlertTriangle className="h-4 w-4" />
                        Informasi Penting
                    </h4>
                    <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-300">
                        <li>
                            • Pengaturan baru hanya berlaku untuk transaksi baru yang
                            diupload
                        </li>
                        <li>
                            • Gunakan tombol "Terapkan ke Transaksi Lama" untuk menerapkan
                            ke data yang sudah ada
                        </li>
                        <li>
                            • Poin yang sudah kadaluarsa akan otomatis hangus dan dikurangi
                            dari total poin member
                        </li>
                        <li>
                            • Member akan melihat peringatan di dashboard jika poin mereka
                            akan segera kadaluarsa
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
