"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClearAllDataSection() {
    const router = useRouter();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleClearAll = async () => {
        if (confirmText !== "HAPUS SEMUA") return;

        setLoading(true);
        try {
            const response = await fetch('/api/clear-all-data', {
                method: 'POST',
            });

            const result = await response.json();

            if (result.success) {
                alert("✅ Semua data berhasil dihapus!\n\nData yang dihapus:\n- Semua Member\n- Semua Transaksi\n- Semua Reward\n- Semua Kampanye\n- Data Store Transaction Source");
                setIsConfirmOpen(false);
                setConfirmText("");
                router.refresh();
            } else {
                alert(result.error || "Gagal menghapus data.");
            }
        } catch (error) {
            alert("Terjadi kesalahan sistem.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/10">
            <div className="flex items-start gap-4">
                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                    <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">
                        Hapus Data Reward System
                    </h3>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                        Menghapus data <strong>internal reward system</strong>:
                    </p>
                    <ul className="mt-2 ml-4 list-disc text-sm text-red-700 dark:text-red-300">
                        <li>Semua Member</li>
                        <li>Semua Transaksi & Poin</li>
                        <li>Semua Reward & Kampanye</li>
                    </ul>
                    <div className="mt-2 rounded-md bg-green-50 p-2 dark:bg-green-900/20">
                        <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                            ✅ Data Toko (Store Transaction Source) TETAP AMAN
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-400">
                            Data POS tidak dihapus, Anda bisa Store Sync ulang kapan saja
                        </p>
                    </div>
                    <p className="mt-2 text-sm font-bold text-red-800 dark:text-red-200">
                        ⚠️ PERINGATAN: Data yang sudah dihapus TIDAK dapat dikembalikan!
                    </p>

                    <button
                        onClick={() => setIsConfirmOpen(true)}
                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                        Hapus Data Reward System
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                        <div className="mb-4 flex items-center gap-3 text-red-600 dark:text-red-400">
                            <AlertTriangle className="h-6 w-6" />
                            <h3 className="text-lg font-bold">⚠️ Konfirmasi Penghapusan</h3>
                        </div>

                        <div className="mb-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                            <p className="text-sm font-bold text-red-800 dark:text-red-300">
                                Akan dihapus:
                            </p>
                            <ul className="mt-2 ml-4 list-disc text-sm text-red-700 dark:text-red-400">
                                <li>Member Table (semua member)</li>
                                <li>Transaction Table (semua transaksi)</li>
                                <li>Reward Winners & Campaigns</li>
                                <li>Reward Redemptions & Catalog</li>
                            </ul>
                        </div>

                        <div className="mb-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                            <p className="text-sm font-bold text-green-800 dark:text-green-300">
                                ✅ Tetap aman (TIDAK dihapus):
                            </p>
                            <ul className="mt-2 ml-4 list-disc text-sm text-green-700 dark:text-green-400">
                                <li>Store Transaction Source (Data POS/Toko)</li>
                            </ul>
                            <p className="mt-2 text-xs text-green-600 dark:text-green-500">
                                Anda tetap bisa Store Sync ulang setelah ini
                            </p>
                        </div>

                        <p className="mb-4 text-gray-600 dark:text-gray-300">
                            Tindakan ini <strong>PERMANEN</strong> dan tidak dapat dibatalkan.
                            <br /><br />
                            Ketik <strong className="text-red-600">HAPUS SEMUA</strong> untuk mengonfirmasi.
                        </p>

                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                            placeholder="Ketik: HAPUS SEMUA"
                            className="mb-4 w-full rounded-lg border border-gray-300 p-2 text-center font-bold uppercase tracking-widest focus:border-red-500 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setIsConfirmOpen(false);
                                    setConfirmText("");
                                }}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                disabled={loading}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleClearAll}
                                disabled={confirmText !== "HAPUS SEMUA" || loading}
                                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading && (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                )}
                                Konfirmasi Hapus Semua
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
