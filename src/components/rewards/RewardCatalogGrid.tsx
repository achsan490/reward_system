"use client";

import { useState } from "react";
import { Gift, Package, Calendar } from "lucide-react";
import { redeemReward } from "@/app/actions/reward-redemption";

interface RewardCatalogGridProps {
    catalogs: any[];
    member: any;
    onRedeemSuccess: () => void;
}

export default function RewardCatalogGrid({
    catalogs,
    member,
    onRedeemSuccess,
}: RewardCatalogGridProps) {
    const [selectedReward, setSelectedReward] = useState<any>(null);
    const [redeeming, setRedeeming] = useState(false);
    const [notes, setNotes] = useState("");

    const handleRedeem = async () => {
        if (!member || !selectedReward) return;

        setRedeeming(true);
        const result = await redeemReward(member.id, selectedReward.id, notes);
        setRedeeming(false);

        if (result.success) {
            alert("✅ Penukaran berhasil! Silakan cek menu 'Riwayat Penukaran Saya' untuk melihat tiket dan status.");
            setSelectedReward(null);
            setNotes("");
            onRedeemSuccess();
        } else {
            alert(`❌ ${result.error}`);
        }
    };

    const canAfford = (pointsRequired: number) => {
        return member && member.totalPoints >= pointsRequired;
    };

    const isExpired = (validUntil: Date | null) => {
        if (!validUntil) return false;
        return new Date(validUntil) < new Date();
    };

    const isOutOfStock = (stock: number | null) => {
        return stock !== null && stock <= 0;
    };

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {catalogs.length === 0 ? (
                    <div className="col-span-full rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
                        <Gift className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                            {member
                                ? "Belum ada reward yang tersedia"
                                : "Masukkan Member ID untuk melihat reward"}
                        </p>
                    </div>
                ) : (
                    catalogs.map((catalog) => {
                        const affordable = canAfford(catalog.pointsRequired);
                        const expired = isExpired(catalog.validUntil);
                        const outOfStock = isOutOfStock(catalog.stock);
                        const canRedeem = member && affordable && !expired && !outOfStock;

                        return (
                            <div
                                key={catalog.id}
                                className={`overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-900 ${canRedeem
                                    ? "border-brand-200 dark:border-brand-800"
                                    : "border-gray-200 dark:border-gray-800"
                                    }`}
                            >
                                {/* Image */}
                                {catalog.imageUrl ? (
                                    <img
                                        src={catalog.imageUrl}
                                        alt={catalog.name}
                                        className="h-48 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/20 dark:to-brand-800/20">
                                        <Gift className="h-16 w-16 text-brand-400 dark:text-brand-600" />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-4">
                                    <div className="mb-2 flex items-start justify-between">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {catalog.name}
                                        </h3>
                                        {catalog.category && (
                                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                                {catalog.category}
                                            </span>
                                        )}
                                    </div>

                                    {catalog.description && (
                                        <p className="mb-3 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
                                            {catalog.description}
                                        </p>
                                    )}

                                    {/* Points */}
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                                            {catalog.pointsRequired.toLocaleString("id-ID")}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            poin
                                        </span>
                                    </div>

                                    {/* Stock & Expiry */}
                                    <div className="mb-3 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Package className="h-3 w-3" />
                                            {catalog.stock === null
                                                ? "Stock: Unlimited"
                                                : `Stock: ${catalog.stock}`}
                                        </div>
                                        {catalog.validUntil && (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Valid until:{" "}
                                                {new Date(catalog.validUntil).toLocaleDateString("id-ID")}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Messages */}
                                    {expired && (
                                        <div className="mb-2 rounded bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                            ⚠️ Reward sudah kadaluarsa
                                        </div>
                                    )}
                                    {outOfStock && (
                                        <div className="mb-2 rounded bg-gray-50 p-2 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                            📦 Stock habis
                                        </div>
                                    )}
                                    {member && !affordable && !expired && !outOfStock && (
                                        <div className="mb-2 rounded bg-orange-50 p-2 text-xs text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                                            💰 Poin tidak cukup (butuh {catalog.pointsRequired - member.totalPoints} poin lagi)
                                        </div>
                                    )}

                                    {/* Redeem Button */}
                                    <button
                                        onClick={() => setSelectedReward(catalog)}
                                        disabled={!canRedeem}
                                        className={`w-full rounded-lg px-4 py-2 font-medium transition-colors ${canRedeem
                                            ? "bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
                                            : "cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-600"
                                            }`}
                                    >
                                        {canRedeem ? "Tukar Poin" : "Tidak Bisa Ditukar"}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Redeem Modal */}
            {selectedReward && member && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelectedReward(null)}
                >
                    <div
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Konfirmasi Penukaran
                        </h3>

                        <div className="mt-4 space-y-3">
                            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Reward</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {selectedReward.name}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Poin Digunakan</p>
                                <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
                                    {selectedReward.pointsRequired.toLocaleString("id-ID")} poin
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Sisa Poin</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {(member.totalPoints - selectedReward.pointsRequired).toLocaleString("id-ID")} poin
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Catatan (opsional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="Tambahkan catatan jika perlu..."
                                />
                            </div>
                        </div>

                        <div className="mt-6 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                            ℹ️ Penukaran akan menunggu approval dari admin. Poin akan dikurangi setelah disetujui.
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => {
                                    setSelectedReward(null);
                                    setNotes("");
                                }}
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleRedeem}
                                disabled={redeeming}
                                className="flex-1 rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
                            >
                                {redeeming ? "Processing..." : "Tukar Sekarang"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
