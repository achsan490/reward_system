"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Gift, TrendingUp, User, Phone } from "lucide-react";
import { getActiveRewardCatalogs } from "@/app/actions/reward-catalog";
import { getMemberByMemberId, getMemberByPhone } from "@/app/actions/member-portal";
import RewardCatalogGrid from "@/components/rewards/RewardCatalogGrid";

type SearchType = "memberId" | "phone";

export default function MemberRewardsPage() {
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

    const handleSearchDirect = async (type: SearchType, value: string) => {
        if (!value.trim()) {
            setError(type === "memberId" ? "Masukkan Member ID" : "Masukkan Nomor WhatsApp");
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

    const handleSearch = async () => {
        await handleSearchDirect(searchType, searchValue);
    };

    const filteredCatalogs = filter === "affordable" && member
        ? catalogs.filter((c) => c.pointsRequired <= member.totalPoints)
        : catalogs;

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        🎁 Reward Catalog
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Tukarkan poin Anda dengan hadiah menarik
                    </p>
                    {member && (
                        <a
                            href={`/member/check?${searchType === "memberId" ? `id=${member.memberId}` : `phone=${searchValue}`}`}
                            className="mt-3 inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                        >
                            ← Kembali ke Cek Poin
                        </a>
                    )}
                </div>

                {/* Search Form */}
                <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    {/* Search Type Tabs */}
                    <div className="mb-4 flex gap-2 rounded-lg bg-gray-50 p-1 dark:bg-gray-800">
                        <button
                            type="button"
                            onClick={() => {
                                setSearchType("memberId");
                                setSearchValue("");
                                setError("");
                                setMember(null);
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${searchType === "memberId"
                                ? "bg-brand-600 text-white shadow-sm dark:bg-brand-500"
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
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
                                setMember(null);
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${searchType === "phone"
                                ? "bg-brand-600 text-white shadow-sm dark:bg-brand-500"
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                }`}
                        >
                            <Phone className="h-4 w-4" />
                            Nomor WhatsApp
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            placeholder={
                                searchType === "memberId"
                                    ? "Masukkan Member ID (contoh: M001)"
                                    : "Masukkan Nomor WhatsApp (contoh: 081234567890)"
                            }
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            disabled={loading}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
                        >
                            <Search className="h-5 w-5" />
                            {loading ? "Mencari..." : "Cari"}
                        </button>
                    </div>

                    {/* Loading State for Auto-submit */}
                    {loading && autoSubmitted && (
                        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
                            <div className="flex items-center justify-center gap-2 text-blue-800 dark:text-blue-400">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-800 border-t-transparent dark:border-blue-400"></div>
                                <p className="font-medium">Memuat data member Anda...</p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {member && (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/40">
                                        <Gift className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Member
                                        </p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            {member.name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-gradient-to-br from-brand-50 to-white p-4 dark:from-brand-900/20 dark:to-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-brand-100 p-2 dark:bg-brand-900/40">
                                        <TrendingUp className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Poin Tersedia
                                        </p>
                                        <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                                            {member.totalPoints.toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Filter */}
                {member && (
                    <div className="mb-6 flex items-center gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`rounded-lg px-4 py-2 text-sm font-medium ${filter === "all"
                                ? "bg-brand-600 text-white dark:bg-brand-500"
                                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                                }`}
                        >
                            Semua Reward
                        </button>
                        <button
                            onClick={() => setFilter("affordable")}
                            className={`rounded-lg px-4 py-2 text-sm font-medium ${filter === "affordable"
                                ? "bg-brand-600 text-white dark:bg-brand-500"
                                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                                }`}
                        >
                            Bisa Ditukar ({catalogs.filter((c) => c.pointsRequired <= member.totalPoints).length})
                        </button>
                    </div>
                )}

                {/* Catalog Grid */}
                <RewardCatalogGrid
                    catalogs={filteredCatalogs}
                    member={member}
                    onRedeemSuccess={() => {
                        handleSearch(); // Refresh member data
                        loadCatalogs(); // Refresh catalogs
                    }}
                />
            </div>
        </div>
    );
}
