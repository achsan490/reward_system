"use client";

import { Trophy, CheckCircle, XCircle, Mail, Phone, User, MessageCircle } from "lucide-react";
import { useState } from "react";
import { markRewardClaimed } from "@/app/actions/rewards";
import { useRouter } from "next/navigation";
import WhatsAppButton from "../common/WhatsAppButton";

interface Winner {
    id: string;
    rank: number;
    pointsAtWin: number;
    spentAtWin: number;
    transactionsAtWin: number;
    rewardClaimed: boolean;
    claimedAt: Date | null;
    notes: string | null;
    member: {
        id: string;
        memberId: string;
        name: string;
        email: string | null;
        phone: string | null;
    };
}

interface WinnersTableProps {
    winners: Winner[];
    criteria: string;
}

export default function WinnersTable({ winners, criteria }: WinnersTableProps) {
    const router = useRouter();
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleToggleClaim = async (winnerId: string, currentStatus: boolean) => {
        setProcessingId(winnerId);
        const result = await markRewardClaimed(winnerId, !currentStatus);

        if (result.success) {
            router.refresh();
        } else {
            alert(result.error || "Gagal mengubah status klaim");
        }
        setProcessingId(null);
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) {
            return (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg">
                    <Trophy className="h-5 w-5 text-white" />
                </div>
            );
        } else if (rank === 2) {
            return (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-lg">
                    <Trophy className="h-5 w-5 text-white" />
                </div>
            );
        } else if (rank === 3) {
            return (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg">
                    <Trophy className="h-5 w-5 text-white" />
                </div>
            );
        } else {
            return (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    #{rank}
                </div>
            );
        }
    };

    const getCriteriaValue = (winner: Winner) => {
        switch (criteria) {
            case "top_points":
                return {
                    label: "Points",
                    value: winner.pointsAtWin.toLocaleString("id-ID"),
                    color: "text-brand-600 dark:text-brand-400",
                };
            case "top_spending":
                return {
                    label: "Total Belanja",
                    value: `Rp ${winner.spentAtWin.toLocaleString("id-ID")}`,
                    color: "text-green-600 dark:text-green-400",
                };
            case "top_transactions":
                return {
                    label: "Transaksi",
                    value: `${winner.transactionsAtWin}x`,
                    color: "text-blue-600 dark:text-blue-400",
                };
            default:
                return {
                    label: "Points",
                    value: winner.pointsAtWin.toLocaleString("id-ID"),
                    color: "text-brand-600 dark:text-brand-400",
                };
        }
    };

    if (winners.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
                <div className="mx-auto mb-4 h-24 w-24 text-gray-400">
                    <Trophy className="h-full w-full" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Belum Ada Pemenang
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Pemenang akan ditentukan secara otomatis setelah campaign dibuat
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {winners.map((winner) => {
                const criteriaInfo = getCriteriaValue(winner);
                return (
                    <div
                        key={winner.id}
                        className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div className="flex items-start gap-4">
                            {/* Rank Badge */}
                            <div className="flex-shrink-0">
                                {getRankBadge(winner.rank)}
                            </div>

                            {/* Member Info */}
                            <div className="flex-1">
                                <div className="mb-2 flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {winner.member.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {winner.member.memberId}
                                        </p>
                                    </div>

                                    {/* Claim Status Badge */}
                                    <div>
                                        {winner.rewardClaimed ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                                <CheckCircle className="h-4 w-4" />
                                                Sudah Diklaim
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                                                <XCircle className="h-4 w-4" />
                                                Belum Diklaim
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="mb-3 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    {winner.member.email && (
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="h-4 w-4" />
                                            {winner.member.email}
                                        </div>
                                    )}
                                    {winner.member.phone && (
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="h-4 w-4" />
                                            {winner.member.phone}
                                        </div>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="mb-3 grid grid-cols-3 gap-3">
                                    <div className="rounded-lg bg-brand-50 p-3 dark:bg-brand-900/20">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Points
                                        </p>
                                        <p className="mt-1 text-lg font-bold text-brand-600 dark:text-brand-400">
                                            {winner.pointsAtWin.toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Total Belanja
                                        </p>
                                        <p className="mt-1 text-lg font-bold text-green-600 dark:text-green-400">
                                            Rp {(winner.spentAtWin / 1000).toFixed(0)}K
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Transaksi
                                        </p>
                                        <p className="mt-1 text-lg font-bold text-blue-600 dark:text-blue-400">
                                            {winner.transactionsAtWin}x
                                        </p>
                                    </div>
                                </div>

                                {/* Claimed Info */}
                                {winner.rewardClaimed && winner.claimedAt && (
                                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                                        Diklaim pada:{" "}
                                        {new Date(winner.claimedAt).toLocaleDateString(
                                            "id-ID",
                                            {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </p>
                                )}

                                {/* Notes */}
                                {winner.notes && (
                                    <p className="mb-3 text-sm italic text-gray-600 dark:text-gray-400">
                                        Catatan: {winner.notes}
                                    </p>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleToggleClaim(
                                                winner.id,
                                                winner.rewardClaimed
                                            )
                                        }
                                        disabled={processingId === winner.id}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${winner.rewardClaimed
                                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                            : "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                                            }`}
                                    >
                                        {processingId === winner.id ? (
                                            <span className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Memproses...
                                            </span>
                                        ) : winner.rewardClaimed ? (
                                            "Batalkan Klaim"
                                        ) : (
                                            "Tandai Sudah Diklaim"
                                        )}
                                    </button>

                                    <WhatsAppButton
                                        phone={winner.member.phone}
                                        message={`Kepada Yth. ${winner.member.name}, Selamat! Anda terpilih sebagai pemenang ke-${winner.rank} dengan ${winner.pointsAtWin} poin. Silakan klaim reward Anda.`}
                                        label="Hubungi WA"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
