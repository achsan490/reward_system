"use client";

import { useState } from "react";
import { Calendar, Database, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { fetchStoreTransactions, saveStoreTransactions } from "@/app/actions/storeSync";
import { formatCurrency, formatNumber } from "@/lib/pointCalculator";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface PreviewTransaction {
    memberId: string;
    memberName: string;
    transactionDate: Date;
    amount: number;
    phone?: string;
    pointsEarned: number;
    pointsExpiryDate: Date | null;
    isDuplicate: boolean;
}

export default function StoreDatabaseSync() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [previewData, setPreviewData] = useState<PreviewTransaction[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [successMessage, setSuccessMessage] = useState("");

    const handleFetchData = async () => {
        setError("");
        setSuccessMessage("");

        if (!startDate || !endDate) {
            setError("Mohon pilih tanggal awal dan tanggal akhir");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            setError("Tanggal akhir harus lebih besar atau sama dengan tanggal awal");
            return;
        }

        setIsLoading(true);
        try {
            const result = await fetchStoreTransactions(startDate, endDate);

            if (result.success) {
                setPreviewData(result.data || []);
                setStats(result.stats);
                if (result.data && result.data.length === 0) {
                    setError(result.message || "Tidak ada transaksi ditemukan");
                }
            } else {
                setError(result.error || "Gagal mengambil data dari database toko");
            }
        } catch (err) {
            setError("Terjadi kesalahan saat mengambil data");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveData = async () => {
        if (previewData.length === 0) {
            setError("Tidak ada data untuk disimpan");
            return;
        }

        setIsSaving(true);
        setError("");
        setSuccessMessage("");

        try {
            const result = await saveStoreTransactions(previewData);

            if (result.success) {
                setSuccessMessage(result.message || "Data berhasil disimpan");
                // Clear preview after successful save
                setTimeout(() => {
                    setPreviewData([]);
                    setStats(null);
                    setStartDate("");
                    setEndDate("");
                }, 2000);
            } else {
                setError(result.error || "Gagal menyimpan data");
            }
        } catch (err) {
            setError("Terjadi kesalahan saat menyimpan data");
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setStartDate("");
        setEndDate("");
        setError("");
        setSuccessMessage("");
        setPreviewData([]);
        setStats(null);
    };

    return (
        <div className="space-y-6">
            {/* Fetch Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-dark">
                <div className="mb-4 flex items-center gap-2">
                    <Database className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Ambil Data dari Database Toko
                    </h3>
                </div>

                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    Ambil data transaksi langsung dari database toko berdasarkan rentang tanggal.
                    Data akan ditampilkan untuk preview sebelum disimpan.
                </p>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Start Date */}
                    <div>
                        <label
                            htmlFor="storeStartDate"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Dari Tanggal
                        </label>
                        <input
                            type="date"
                            id="storeStartDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            disabled={isLoading || isSaving}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-400"
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label
                            htmlFor="storeEndDate"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Sampai Tanggal
                        </label>
                        <input
                            type="date"
                            id="storeEndDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            disabled={isLoading || isSaving}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-400"
                        />
                    </div>

                    {/* Fetch Button */}
                    <div className="flex items-end">
                        <button
                            onClick={handleFetchData}
                            disabled={isLoading || isSaving}
                            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
                        >
                            {isLoading ? "Mengambil Data..." : "🔄 Ambil Data"}
                        </button>
                    </div>

                    {/* Reset Button */}
                    <div className="flex items-end">
                        <button
                            onClick={handleReset}
                            disabled={isLoading || isSaving}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="mt-4 flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Stats */}
                {stats && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                            <p className="text-xs text-blue-600 dark:text-blue-400">Total Transaksi</p>
                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                {stats.total}
                            </p>
                        </div>
                        <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                            <p className="text-xs text-green-600 dark:text-green-400">Data Baru</p>
                            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                {stats.new}
                            </p>
                        </div>
                        <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                            <p className="text-xs text-yellow-600 dark:text-yellow-400">Duplikat</p>
                            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                                {stats.duplicate}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Table */}
            {previewData.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-dark">
                    <div className="border-b border-gray-200 p-4 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Preview Data ({previewData.length} transaksi)
                            </h3>
                            <button
                                onClick={handleSaveData}
                                disabled={isSaving || stats?.new === 0}
                                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSaving ? "Menyimpan..." : `💾 Simpan ${stats?.new || 0} Data Baru`}
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
                                        Member
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
                                        No. WhatsApp
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-white">
                                        Tanggal
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900 dark:text-white">
                                        Belanja
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900 dark:text-white">
                                        Poin
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {previewData.map((txn, index) => (
                                    <tr
                                        key={index}
                                        className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${txn.isDuplicate ? "opacity-50" : ""
                                            }`}
                                    >
                                        <td className="px-4 py-3">
                                            {txn.isDuplicate ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                                                    <XCircle className="h-3 w-3" />
                                                    Duplikat
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Baru
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {txn.memberName}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    ID: {txn.memberId}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {txn.phone ? (
                                                <a
                                                    href={`https://wa.me/${txn.phone.replace(/^0/, '62')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 hover:underline dark:text-green-400 dark:hover:text-green-300"
                                                >
                                                    <span>📱</span>
                                                    {txn.phone}
                                                </a>
                                            ) : (
                                                <span className="text-xs text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                            {format(new Date(txn.transactionDate), "dd MMM yyyy HH:mm", {
                                                locale: id,
                                            })}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(txn.amount)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
                                                +{formatNumber(txn.pointsEarned)} pts
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
