"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, Clock, CheckCircle, XCircle, User, Phone, ArrowLeft, QrCode, Copy, Check } from "lucide-react";
import { getMemberRedemptions } from "@/app/actions/reward-redemption";
import { getMemberByMemberId, getMemberByPhone } from "@/app/actions/member-portal";

type SearchType = "memberId" | "phone";

function MyRedemptionsContent() {
    const searchParams = useSearchParams();
    const [searchType, setSearchType] = useState<SearchType>("memberId");
    const [searchValue, setSearchValue] = useState("");
    const [member, setMember] = useState<any>(null);
    const [redemptions, setRedemptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [autoSubmitted, setAutoSubmitted] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

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

    const handleSearchDirect = async (type: SearchType, value: string) => {
        if (!value.trim()) {
            setError(type === "memberId" ? "Masukkan Member ID" : "Masukkan Nomor WhatsApp");
            return;
        }

        setLoading(true);
        setError("");
        setMember(null);
        setRedemptions([]);

        let memberResult;
        if (type === "memberId") {
            memberResult = await getMemberByMemberId(value.trim());
        } else {
            memberResult = await getMemberByPhone(value.trim());
        }

        if (memberResult.success && memberResult.data) {
            setMember(memberResult.data);
            // Fetch redemptions
            const redemptionResult = await getMemberRedemptions(memberResult.data.id);
            if (redemptionResult.success) {
                setRedemptions(redemptionResult.data || []);
            }
        } else {
            setError(memberResult.error || "Member tidak ditemukan");
        }
        setLoading(false);
    };

    const handleSearch = async () => {
        await handleSearchDirect(searchType, searchValue);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "approved":
                return {
                    bg: "bg-green-50 dark:bg-green-900/20",
                    border: "border-green-200 dark:border-green-800",
                    text: "text-green-700 dark:text-green-400",
                    icon: <CheckCircle className="h-5 w-5" />,
                    label: "Disetujui - Siap Diambil"
                };
            case "pending":
                return {
                    bg: "bg-yellow-50 dark:bg-yellow-900/20",
                    border: "border-yellow-200 dark:border-yellow-800",
                    text: "text-yellow-700 dark:text-yellow-400",
                    icon: <Clock className="h-5 w-5" />,
                    label: "Menunggu Konfirmasi"
                };
            case "rejected":
                return {
                    bg: "bg-red-50 dark:bg-red-900/20",
                    border: "border-red-200 dark:border-red-800",
                    text: "text-red-700 dark:text-red-400",
                    icon: <XCircle className="h-5 w-5" />,
                    label: "Permintaan Ditolak"
                };
            case "completed":
                return {
                    bg: "bg-blue-50 dark:bg-blue-900/20",
                    border: "border-blue-200 dark:border-blue-800",
                    text: "text-blue-700 dark:text-blue-400",
                    icon: <CheckCircle className="h-5 w-5" />,
                    label: "Selesai (Sudah Diambil)"
                };
            default:
                return {
                    bg: "bg-gray-50 dark:bg-gray-800",
                    border: "border-gray-200 dark:border-gray-700",
                    text: "text-gray-600 dark:text-gray-400",
                    icon: <Package className="h-5 w-5" />,
                    label: status
                };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center rounded-full bg-brand-100 p-3 mb-4 dark:bg-brand-900/30">
                        <Package className="h-8 w-8 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">
                        Tiket Penukaran Saya
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                        Tunjukkan tiket digital ini kepada petugas toko untuk mengambil reward Anda.
                    </p>

                    {member && (
                        <div className="mt-6">
                            <a
                                href={`/member/rewards?${searchType === "memberId" ? `id=${member.memberId}` : `phone=${searchValue}`}`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke Katalog Reward
                            </a>
                        </div>
                    )}
                </div>

                {/* Search / Login Section */}
                {!member && (
                    <div className="mx-auto max-w-xl mb-12 transform transition-all hover:scale-[1.01]">
                        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Cek Tiket Anda</h2>

                            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg dark:bg-gray-700 mb-6">
                                <button
                                    onClick={() => {
                                        setSearchType("memberId");
                                        setSearchValue("");
                                        setError("");
                                    }}
                                    className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${searchType === "memberId"
                                            ? "bg-white text-brand-600 shadow-sm dark:bg-gray-800 dark:text-brand-400"
                                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                        }`}
                                >
                                    Member ID
                                </button>
                                <button
                                    onClick={() => {
                                        setSearchType("phone");
                                        setSearchValue("");
                                        setError("");
                                    }}
                                    className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${searchType === "phone"
                                            ? "bg-white text-brand-600 shadow-sm dark:bg-gray-800 dark:text-brand-400"
                                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                        }`}
                                >
                                    WhatsApp
                                </button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    {searchType === "memberId" ? <User className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                                </div>
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                    placeholder={searchType === "memberId" ? "Contoh: M001" : "Contoh: 08123456789"}
                                    className="block w-full pl-12 pr-4 py-4 rounded-xl border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white transition-all dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-brand-400"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="mt-6 w-full flex items-center justify-center gap-2 py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Mencari...
                                    </>
                                ) : (
                                    <>
                                        <Search className="h-5 w-5" />
                                        Lihat Tiket Saya
                                    </>
                                )}
                            </button>

                            {error && (
                                <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm text-center animate-shake dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {member && (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Member Greeting */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Halo, {member.name}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Member ID: <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{member.memberId}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Poin Tersedia</p>
                                <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{member.totalPoints.toLocaleString("id-ID")}</p>
                            </div>
                        </div>

                        {/* Loading State for Fetching Redemptions */}
                        {loading && (
                            <div className="py-12 text-center">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-400">Memuat data tiket...</p>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && redemptions.length === 0 && (
                            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <Package className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                                    Belum Ada Tiket
                                </h3>
                                <p className="mt-2 text-gray-500 max-w-sm mx-auto dark:text-gray-400">
                                    Anda belum memiliki riwayat penukaran hadiah. Yuk tukarkan poin Anda sekarang!
                                </p>
                                <a
                                    href={`/member/rewards?${searchType === "memberId" ? `id=${member.memberId}` : `phone=${searchValue}`}`}
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-medium text-white shadow-lg shadow-brand-500/30 hover:bg-brand-700 hover:shadow-xl transition-all dark:bg-brand-500 dark:hover:bg-brand-600"
                                >
                                    Buka Katalog Reward
                                </a>
                            </div>
                        )}

                        {/* Tickets List */}
                        {!loading && redemptions.map((redemption) => {
                            const styles = getStatusStyles(redemption.status);
                            const claimCode = (redemption.claimCode || redemption.id.slice(-8)).toUpperCase();

                            return (
                                <div key={redemption.id} className="relative group perspective">
                                    {/* Ticket Container */}
                                    <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700 transform transition-all hover:scale-[1.01] hover:shadow-xl">

                                        {/* Status Bar */}
                                        <div className={`px-6 py-3 border-b flex items-center justify-between ${styles.bg} ${styles.border}`}>
                                            <div className={`flex items-center gap-2 font-medium ${styles.text}`}>
                                                {styles.icon}
                                                <span>{styles.label}</span>
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                {new Date(redemption.redeemedAt).toLocaleDateString("id-ID", {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex flex-col md:flex-row">
                                            {/* Image Section */}
                                            <div className="md:w-1/3 bg-gray-100 dark:bg-gray-900 relative min-h-[200px] md:min-h-full">
                                                {redemption.catalog.imageUrl ? (
                                                    <img
                                                        src={redemption.catalog.imageUrl}
                                                        alt={redemption.catalog.name}
                                                        className="h-full w-full object-cover absolute inset-0"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center p-8">
                                                        <Package className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                                                    </div>
                                                )}
                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10"></div>
                                                <div className="absolute bottom-4 left-4 text-white md:hidden">
                                                    <p className="text-xs font-medium opacity-90">{redemption.catalog.category}</p>
                                                    <p className="font-bold text-lg shadow-black/50 drop-shadow-md">{redemption.catalog.name}</p>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                                                <div className="hidden md:block">
                                                    {redemption.catalog.category && (
                                                        <span className="inline-block px-2 py-1 rounded text-xs font-semibold tracking-wide bg-gray-100 text-gray-600 mb-2 dark:bg-gray-700 dark:text-gray-300">
                                                            {redemption.catalog.category}
                                                        </span>
                                                    )}
                                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                        {redemption.catalog.name}
                                                    </h3>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                                                        {redemption.catalog.description || "Tukarkan poin Anda dengan hadiah ini."}
                                                    </p>
                                                </div>

                                                <div className="mt-6 pt-6 border-t border-dashed border-gray-200 dark:border-gray-700">
                                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                                        <div className="text-center sm:text-left w-full">
                                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Kode Penukaran</p>
                                                            <div className="flex items-center justify-center sm:justify-start gap-3">
                                                                <code className="text-3xl font-mono font-bold text-brand-600 tracking-wider dark:text-brand-400">
                                                                    {claimCode}
                                                                </code>
                                                                <button
                                                                    onClick={() => copyToClipboard(claimCode, redemption.id)}
                                                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors dark:hover:bg-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
                                                                    title="Salin Kode"
                                                                >
                                                                    {copiedId === redemption.id ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex-shrink-0 bg-white p-2 rounded-lg border border-gray-100 shadow-sm dark:bg-gray-700 dark:border-gray-600">
                                                            <div className="flex flex-col items-center justify-center gap-1 w-24 h-24 bg-gray-50 rounded dark:bg-gray-800">
                                                                <QrCode className="h-12 w-12 text-gray-800 dark:text-white" />
                                                                <span className="text-[10px] text-gray-500 font-medium">SCAN ADMIN</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Decorative Circles (Ticket Holes) */}
                                        <div className="absolute left-[-10px] top-[60px] md:top-auto md:bottom-[40%] h-5 w-5 rounded-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700"></div>
                                        <div className="absolute right-[-10px] top-[60px] md:top-auto md:bottom-[40%] h-5 w-5 rounded-full bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MyRedemptionsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Memuat Tiket...</p>
                </div>
            </div>
        }>
            <MyRedemptionsContent />
        </Suspense>
    );
}
