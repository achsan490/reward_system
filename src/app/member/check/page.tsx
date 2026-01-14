"use client";

export const runtime = "nodejs";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, AlertTriangle, TrendingUp, Calendar, Receipt, User, Phone, Gift } from "lucide-react";
import { getMemberByMemberId, getMemberByPhone } from "@/app/actions/member-portal";
import { formatDateShortID, getDaysUntilExpiry, formatExpiryWarning } from "@/lib/expirationUtils";

type SearchType = "memberId" | "phone";

function MemberCheckContent() {
    const searchParams = useSearchParams();
    const [searchType, setSearchType] = useState<SearchType>("memberId");
    const [searchValue, setSearchValue] = useState("");
    const [memberData, setMemberData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [autoSubmitted, setAutoSubmitted] = useState(false);

    // Auto-fill and auto-submit from URL parameters
    useEffect(() => {
        const idParam = searchParams.get("id");
        const phoneParam = searchParams.get("phone");

        if (idParam && !autoSubmitted) {
            setSearchType("memberId");
            setSearchValue(idParam);
            // Auto-submit after a brief delay to ensure state is set
            setTimeout(() => {
                handleCheckDirect("memberId", idParam);
            }, 100);
            setAutoSubmitted(true);
        } else if (phoneParam && !autoSubmitted) {
            setSearchType("phone");
            setSearchValue(phoneParam);
            // Auto-submit after a brief delay to ensure state is set
            setTimeout(() => {
                handleCheckDirect("phone", phoneParam);
            }, 100);
            setAutoSubmitted(true);
        }
    }, [searchParams, autoSubmitted]);

    // Direct check function for auto-submit
    const handleCheckDirect = async (type: SearchType, value: string) => {
        setLoading(true);
        setError("");
        setMemberData(null);

        let result;
        if (type === "memberId") {
            result = await getMemberByMemberId(value);
        } else {
            result = await getMemberByPhone(value);
        }

        setLoading(false);

        if (result.success) {
            setMemberData(result.data);
        } else {
            setError(result.error || "Member tidak ditemukan");
        }
    };

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleCheckDirect(searchType, searchValue);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        🎯 Cek Poin Reward Anda
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Masukkan Member ID atau Nomor WhatsApp untuk melihat poin Anda
                    </p>
                </div>

                {/* Search Type Tabs */}
                <div className="mb-4 flex gap-2 rounded-lg bg-white p-1 shadow-sm dark:bg-gray-900">
                    <button
                        type="button"
                        onClick={() => {
                            setSearchType("memberId");
                            setSearchValue("");
                            setError("");
                            setMemberData(null);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${searchType === "memberId"
                            ? "bg-brand-600 text-white shadow-sm dark:bg-brand-500"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                            }`}
                    >
                        <User className="h-4 w-4" />
                        Member ID
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSearchType("phone");
                            setSearchValue("");
                            setError("");
                            setMemberData(null);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${searchType === "phone"
                            ? "bg-brand-600 text-white shadow-sm dark:bg-brand-500"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                            }`}
                    >
                        <Phone className="h-4 w-4" />
                        Nomor WhatsApp
                    </button>
                </div>

                {/* Search Form */}
                <form onSubmit={handleCheck} className="mb-8">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={
                                searchType === "memberId"
                                    ? "Masukkan Member ID (contoh: M001)"
                                    : "Masukkan Nomor WhatsApp (contoh: 081234567890)"
                            }
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            required
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
                        >
                            <Search className="h-5 w-5" />
                            {loading ? "Mencari..." : "Cek Poin"}
                        </button>
                    </div>
                </form>

                {/* Loading State for Auto-submit */}
                {loading && autoSubmitted && (
                    <div className="mb-6 rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
                        <div className="flex items-center justify-center gap-2 text-blue-800 dark:text-blue-400">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-800 border-t-transparent dark:border-blue-400"></div>
                            <p className="font-medium">Memuat data member Anda...</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Member Data */}
                {memberData && (
                    <div className="space-y-6">
                        {/* Member Info Card */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                                Informasi Member
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Nama</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {memberData.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Member ID</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {memberData.memberId}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Points Card */}
                        <div className="rounded-lg border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-lg dark:border-brand-800 dark:from-brand-900/20 dark:to-gray-900">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-brand-100 p-3 dark:bg-brand-900/40">
                                    <TrendingUp className="h-8 w-8 text-brand-600 dark:text-brand-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Poin Anda</p>
                                    <p className="text-4xl font-bold text-brand-600 dark:text-brand-400">
                                        {memberData.totalPoints.toLocaleString("id-ID")}
                                    </p>
                                </div>
                            </div>

                            {/* Redeem Rewards Button */}
                            <a
                                href={`/member/rewards?${searchType === "memberId" ? `id=${memberData.memberId}` : `phone=${searchValue}`}`}
                                className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-brand-700 hover:to-brand-800 hover:shadow-lg dark:from-brand-500 dark:to-brand-600"
                            >
                                <Gift className="h-5 w-5" />
                                Tukar Poin dengan Reward
                            </a>
                        </div>

                        {/* Expiring Points Warning */}
                        {memberData.expiringPoints && memberData.expiringPoints.totalExpiringPoints > 0 && (
                            <div className="rounded-lg border-2 border-red-300 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                    <div>
                                        <h3 className="font-semibold text-red-900 dark:text-red-300">
                                            ⚠️ Peringatan Poin Kadaluarsa!
                                        </h3>
                                        <p className="mt-1 text-sm text-red-800 dark:text-red-400">
                                            <span className="font-semibold">
                                                {memberData.expiringPoints.totalExpiringPoints.toLocaleString("id-ID")} poin
                                            </span>{" "}
                                            akan kadaluarsa pada{" "}
                                            <span className="font-semibold">
                                                {formatDateShortID(memberData.expiringPoints.earliestExpiryDate)}
                                            </span>
                                            {memberData.expiringPoints.earliestExpiryDate && (
                                                <span className="ml-1">
                                                    ({formatExpiryWarning(getDaysUntilExpiry(memberData.expiringPoints.earliestExpiryDate))})
                                                </span>
                                            )}
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-red-900 dark:text-red-300">
                                            Segera tukarkan poin Anda sebelum hangus!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transaction History */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                Riwayat Transaksi Terakhir
                            </h3>
                            {memberData.transactions.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400">
                                    Belum ada transaksi
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {memberData.transactions.map((txn: any) => (
                                        <div
                                            key={txn.id}
                                            className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                                                    <Receipt className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        Rp {txn.amount.toLocaleString("id-ID")}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(txn.transactionDate).toLocaleDateString("id-ID")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                                                    +{txn.pointsEarned} poin
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Belanja</p>
                                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                                    Rp {memberData.totalSpent.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Transaksi</p>
                                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                                    {memberData.transactionCount}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MemberCheckPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat...</p>
                </div>
            </div>
        }>
            <MemberCheckContent />
        </Suspense>
    );
}
