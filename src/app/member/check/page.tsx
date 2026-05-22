"use client";

export const runtime = "nodejs";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, AlertTriangle, TrendingUp, Receipt, User, Phone, Gift, ArrowRight } from "lucide-react";
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
            setTimeout(() => {
                handleCheckDirect("memberId", idParam);
            }, 100);
            setAutoSubmitted(true);
        } else if (phoneParam && !autoSubmitted) {
            setSearchType("phone");
            setSearchValue(phoneParam);
            setTimeout(() => {
                handleCheckDirect("phone", phoneParam);
            }, 100);
            setAutoSubmitted(true);
        }
    }, [searchParams, autoSubmitted]);

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-10 text-center animate-fadeIn">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
                            Member Portal
                        </span>
                    </h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                        Cek poin Anda dan tukarkan dengan hadiah menarik!
                    </p>
                </div>

                {/* Search Card - Only show if not auto-submitted via QR and no member data yet */}
                {!memberData && !searchParams.get("id") && !searchParams.get("phone") && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-[1.01] dark:bg-gray-800 dark:border dark:border-gray-700 animate-slideUp">
                        <div className="mb-6 flex p-1 bg-gray-100 rounded-xl dark:bg-gray-700">
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchType("memberId");
                                    setSearchValue("");
                                    setError("");
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all ${searchType === "memberId"
                                        ? "bg-white text-brand-600 shadow-md transform scale-[1.02] dark:bg-gray-800 dark:text-brand-400"
                                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
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
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all ${searchType === "phone"
                                        ? "bg-white text-brand-600 shadow-md transform scale-[1.02] dark:bg-gray-800 dark:text-brand-400"
                                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                    }`}
                            >
                                <Phone className="h-4 w-4" />
                                WhatsApp
                            </button>
                        </div>

                        <form onSubmit={handleCheck}>
                            <div className="relative mb-6">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    {searchType === "memberId" ? <User className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                                </div>
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder={
                                        searchType === "memberId"
                                            ? "Masukkan Member ID (contoh: M001)"
                                            : "Masukkan Nomor WhatsApp (contoh: 08123456789)"
                                    }
                                    className="block w-full pl-12 pr-4 py-4 rounded-xl border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white transition-all text-lg dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-brand-400"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Mencari...
                                    </>
                                ) : (
                                    <>
                                        <Search className="h-5 w-5" />
                                        Cek Poin Sekarang
                                    </>
                                )}
                            </button>
                        </form>

                        {error && (
                            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm text-center animate-shake dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                {error}
                            </div>
                        )}
                    </div>
                )}

                {/* Loading State for Auto-submit */}
                {loading && autoSubmitted && (
                    <div className="flex flex-col items-center justify-center p-12">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mb-4"></div>
                        <p className="text-gray-600 font-medium">Memuat data member...</p>
                    </div>
                )}

                {/* Results Dashboard */}
                {memberData && (
                    <div className="space-y-6 animate-fadeIn">

                        {/* Member Info & Points Hero */}
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                            <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <p className="text-brand-100 font-medium text-sm uppercase tracking-wider mb-1">Selamat Datang</p>
                                        <h2 className="text-3xl font-bold">{memberData.name}</h2>
                                        <div className="flex items-center gap-2 mt-2 opacity-90">
                                            <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-mono">{memberData.memberId}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-brand-100 text-sm mb-1">Total Poin</p>
                                        <p className="text-5xl font-extrabold tracking-tight">{memberData.totalPoints.toLocaleString("id-ID")}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <a
                                    href={`/member/rewards?${searchType === "memberId" ? `id=${memberData.memberId}` : `phone=${searchValue}`}`}
                                    className="group flex flex-col justify-center items-center p-6 rounded-2xl bg-brand-50 border-2 border-brand-100 hover:border-brand-300 hover:bg-brand-100 transition-all cursor-pointer dark:bg-brand-900/20 dark:border-brand-800 dark:hover:bg-brand-900/30"
                                >
                                    <div className="w-12 h-12 bg-brand-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform dark:bg-brand-800">
                                        <Gift className="h-6 w-6 text-brand-700 dark:text-brand-300" />
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-white">Tukar Poin</span>
                                    <span className="text-xs text-brand-700 mt-1 dark:text-brand-400">Lihat Katalog Reward</span>
                                </a>

                                <a
                                    href={`/member/my-redemptions?${searchType === "memberId" ? `id=${memberData.memberId}` : `phone=${searchValue}`}`}
                                    className="group flex flex-col justify-center items-center p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-brand-300 hover:bg-gray-50 transition-all cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500"
                                >
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform dark:bg-gray-600">
                                        <Receipt className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-white">Tiket Saya</span>
                                    <span className="text-xs text-gray-500 mt-1 dark:text-gray-400">Cek Status Penukaran</span>
                                </a>
                            </div>
                        </div>

                        {/* Expiring Points Warning */}
                        {memberData.expiringPoints && memberData.expiringPoints.totalExpiringPoints > 0 && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm dark:bg-red-900/10 dark:border-red-900/30 animate-pulse-slow">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center dark:bg-red-900/30">
                                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-red-900 dark:text-red-400">
                                            Poin Segera Hangus!
                                        </h3>
                                        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                            Sebanyak <span className="font-bold">{memberData.expiringPoints.totalExpiringPoints.toLocaleString("id-ID")} poin</span> akan kadaluarsa pada {formatDateShortID(memberData.expiringPoints.earliestExpiryDate)}.
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-red-800 dark:text-red-300">
                                            Ayo tukarkan sekarang sebelum hilang!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900 dark:text-white">Aktivitas Terakhir</h3>
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full dark:bg-gray-700 dark:text-gray-400">
                                    {memberData.transactions.length} Transaksi
                                </span>
                            </div>

                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {memberData.transactions.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        Belum ada riwayat transaksi.
                                    </div>
                                ) : (
                                    memberData.transactions.map((txn: any) => (
                                        <div key={txn.id} className="p-4 hover:bg-gray-50 transition-colors dark:hover:bg-gray-700/50 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                                    <TrendingUp className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">Pembelian</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(txn.transactionDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 dark:text-white">Rp {txn.amount.toLocaleString("id-ID")}</p>
                                                <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">+{txn.pointsEarned} Poin</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Additional Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold dark:text-gray-400">Total Belanja</p>
                                <p className="text-xl font-bold text-gray-900 mt-1 dark:text-white">Rp {memberData.totalSpent.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold dark:text-gray-400">Total Transaksi</p>
                                <p className="text-xl font-bold text-gray-900 mt-1 dark:text-white">{memberData.transactionCount}x</p>
                            </div>
                        </div>

                        {/* Back Button (Logout) - Hide if accessed via QR to prevent manual searching */}
                        {!searchParams.get("id") && !searchParams.get("phone") && (
                            <button
                                onClick={() => setMemberData(null)}
                                className="w-full py-4 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                ← Kembali ke Pencarian
                            </button>
                        )}

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
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat Portal...</p>
                </div>
            </div>
        }>
            <MemberCheckContent />
        </Suspense>
    );
}
