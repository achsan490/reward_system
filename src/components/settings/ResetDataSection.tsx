"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { resetTransactionData } from "@/app/actions/settings";
import { useRouter } from "next/navigation";

export default function ResetDataSection() {
    const router = useRouter();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (confirmText !== "HAPUS") return;

        setLoading(true);
        try {
            const result = await resetTransactionData();
            if (result.success) {
                alert("Semua data transaksi berhasil dihapus.");
                setIsConfirmOpen(false);
                setConfirmText("");
                router.refresh();
            } else {
                alert(result.error || "Gagal menghapus data transaksi.");
            }
        } catch (error) {
            alert("Terjadi kesalahan sistem.");
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
                        Reset Data Transaksi
                    </h3>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                        Menghapus semua riwayat transaksi member. Poin member akan di-reset menjadi 0.
                        <br />
                        <strong>Peringatan:</strong> Data yang sudah dihapus tidak dapat dikembalikan.
                    </p>

                    <button
                        onClick={() => setIsConfirmOpen(true)}
                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                        Hapus Semua Data
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                        <div className="mb-4 flex items-center gap-3 text-red-600 dark:text-red-400">
                            <AlertTriangle className="h-6 w-6" />
                            <h3 className="text-lg font-bold">Konfirmasi Penghapusan</h3>
                        </div>

                        <p className="mb-4 text-gray-600 dark:text-gray-300">
                            Tindakan ini akan menghapus <strong>SEMUA</strong> data transaksi dari sistem.
                            Member akan kehilangan semua poin dan riwayat belanja mereka.
                            <br /><br />
                            Ketik <strong>HAPUS</strong> untuk mengonfirmasi.
                        </p>

                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                            placeholder="Ketik HAPUS"
                            className="mb-4 w-full rounded-lg border border-gray-300 p-2 text-center font-bold uppercase tracking-widest focus:border-red-500 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                disabled={loading}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleReset}
                                disabled={confirmText !== "HAPUS" || loading}
                                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading && (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                )}
                                Konfirmasi Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
