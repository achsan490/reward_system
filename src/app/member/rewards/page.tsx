"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Gift, TrendingUp, User, Phone, Filter } from "lucide-react";
import { getActiveRewardCatalogs } from "@/app/actions/reward-catalog";
import { getMemberByMemberId, getMemberByPhone } from "@/app/actions/member-portal";
import RewardCatalogGrid from "@/components/rewards/RewardCatalogGrid";

type SearchType = "memberId" | "phone";

function MemberRewardsContent() {
    const searchParams = useSearchParams();
    const [searchType, setSearchType] = useState<SearchType>("memberId");
    const [searchValue, setSearchValue] = useState("");
    const [member, setMember] = useState<any>(null);
    const [catalogs, setCatalogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState<"all" | "affordable">("all");
    const [autoSubmitted, setAutoSubmitted] = useState(false);

    useEffect(() => {
        loadCatalogs();
    }, []);

    // Auto-fill and auto-submit from URL parameters
    useEffect(() => {
        const idParam = searchParams.get("id");
        const phoneParam = searchParams.get("phone");

        if (idParam && !autoSubmitted) {
            setSearchType("memberId");
            setSearchValue(idParam);
            setTimeout(() => {
                handleSearchDirect("memberId", idParam);
            }, 100);
            setAutoSubmitted(true);
        } else if (phoneParam && !autoSubmitted) {
            setSearchType("phone");
            setSearchValue(phoneParam);
            setTimeout(() => {
                handleSearchDirect("phone", phoneParam);
            }, 100);
            setAutoSubmitted(true);
        }
    }, [searchParams, autoSubmitted]);

    const loadCatalogs = async () => {
        const result = await getActiveRewardCatalogs();
        if (result.success) {
            setCatalogs(result.data || []);
        }
    };

    const handleSearch = async () => {
        let type: SearchType = "memberId";
        const val = searchValue.trim();

        // Auto-detect phone number
        if (val.startsWith("08") || val.startsWith("62") || val.startsWith("+62")) {
            type = "phone";
        }

        // If detection changes state, we might want to update it for UI consistency, 
        // but for now just pass to search function.
        setSearchType(type);
        await handleSearchDirect(type, val);
    };

    const handleSearchDirect = async (type: SearchType, value: string) => {
        if (!value.trim()) {
            setError("Masukkan ID atau No. WA");
            return;
        }

        setLoading(true);
        setError("");
        setMember(null);

        let result;
        if (type === "memberId") {
            result = await getMemberByMemberId(value.trim());
        } else {
            result = await getMemberByPhone(value.trim());
        }

        setLoading(false);

        if (result.success) {
            setMember(result.data);
        } else {
            setError(result.error || "Member tidak ditemukan");
        }
    };

    const filteredCatalogs = filter === "affordable" && member
        ? catalogs.filter((c) => c.pointsRequired <= member.totalPoints)
        : catalogs;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12 text-center relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-600 text-xs font-semibold tracking-wide uppercase mb-3 dark:bg-brand-900/30 dark:text-brand-400">
                        Rewards Center
                    </span>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                        Katalog Reward Eksklusif
                    </h1>
                    <p className="max-w-xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                        Tukarkan poin yang Anda kumpulkan dengan berbagai hadiah menarik pilihan kami.
                    </p>

                    {member && (
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <a
                                href={`/member/check?${searchType === "memberId" ? `id=${member.memberId}` : `phone=${searchValue}`}`}
                                className="inline-flex items-center px-4 py-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                            >
                                ← Cek Poin
                            </a>
                            <a
                                href={`/member/my-redemptions?${searchType === "memberId" ? `id=${member.memberId}` : `phone=${searchValue}`}`}
                                className="inline-flex items-center px-4 py-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                            >
                                📋 Lihat Tiket Saya
                            </a>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Left Sidebar: Search & Member Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Search Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 dark:bg-gray-800 dark:border dark:border-gray-700">
                            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4 dark:text-gray-400">Cari Member</h3>

                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                        placeholder="Tulis ID atau No. WA..."
                                        className="block w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 bg-gray-50 text-base focus:border-brand-500 focus:ring-brand-500 transition-shadow dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                        disabled={loading}
                                    />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {loading ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : (
                                        <>
                                            Cari Data
                                        </>
                                    )}
                                </button>
                            </div>
                            {error && (
                                <div className="mt-3 p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2 dark:bg-red-900/20 dark:text-red-400">
                                    <span className="font-bold">!</span> {error}
                                </div>
                            )}
                        </div>

                        {/* Member Info Card */}
                        {member && (
                            <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl shadow-xl p-6 text-white sticky top-4">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                                        <TrendingUp className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-brand-100 text-xs font-medium uppercase">Poin Anda</p>
                                        <p className="text-3xl font-bold">{member.totalPoints.toLocaleString("id-ID")}</p>
                                    </div>
                                </div>
                                <div className="border-t border-white/20 pt-4">
                                    <p className="font-semibold text-lg truncate">{member.name}</p>
                                    <p className="text-brand-100 text-sm font-mono">{member.memberId}</p>
                                </div>

                                {filter === "all" ? (
                                    <button
                                        onClick={() => setFilter("affordable")}
                                        className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Filter className="h-4 w-4" />
                                        Filter: Bisa Ditukar
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setFilter("all")}
                                        className="mt-6 w-full py-2 bg-white text-brand-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors"
                                    >
                                        Tampilkan Semua
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Content: Catalog Grid */}
                    <div className="lg:col-span-3">
                        {member && filter === "affordable" && (
                            <div className="mb-6 bg-brand-50 border border-brand-100 rounded-xl p-4 flex items-center gap-2 text-brand-700 dark:bg-brand-900/20 dark:border-brand-800 dark:text-brand-300">
                                <Filter className="h-5 w-5" />
                                <span className="font-medium">Menampilkan {filteredCatalogs.length} reward yang dapat Anda tukarkan saat ini.</span>
                            </div>
                        )}

                        <RewardCatalogGrid
                            catalogs={filteredCatalogs}
                            member={member}
                            onRedeemSuccess={() => {
                                handleSearch();
                                loadCatalogs();
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MemberRewardsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat Katalog...</p>
                </div>
            </div>
        }>
            <MemberRewardsContent />
        </Suspense>
    );
}
