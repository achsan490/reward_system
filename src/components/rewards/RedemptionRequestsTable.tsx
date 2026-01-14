"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Package, MessageCircle, Trash } from "lucide-react";
import { approveRedemption, rejectRedemption, completeRedemption, deleteRedemption } from "@/app/actions/reward-redemption";
import WhatsAppButton from "../common/WhatsAppButton";

interface RedemptionRequestsTableProps {
    redemptions: any[];
    onRefresh: () => void;
}

export default function RedemptionRequestsTable({
    redemptions,
    onRefresh,
}: RedemptionRequestsTableProps) {
    const [processing, setProcessing] = useState<string | null>(null);
    const [selectedRedemption, setSelectedRedemption] = useState<any>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const handleApprove = async (redemption: any) => {
        if (!confirm(`Approve penukaran reward untuk ${redemption.member.name}?`)) {
            return;
        }

        setProcessing(redemption.id);
        const result = await approveRedemption(
            redemption.id,
            "admin", // TODO: Get from session
            "Approved by admin"
        );
        setProcessing(null);

        if (result.success) {
            onRefresh();
        } else {
            alert(result.error);
        }
    };

    const handleReject = async () => {
        if (!selectedRedemption || !rejectReason.trim()) {
            alert("Alasan penolakan wajib diisi");
            return;
        }

        setProcessing(selectedRedemption.id);
        const result = await rejectRedemption(
            selectedRedemption.id,
            "admin", // TODO: Get from session
            rejectReason
        );
        setProcessing(null);

        if (result.success) {
            setShowRejectModal(false);
            setSelectedRedemption(null);
            setRejectReason("");
            onRefresh();
        } else {
            alert(result.error);
        }
    };

    const handleComplete = async (redemption: any) => {
        if (!confirm(`Tandai sebagai selesai? Pastikan hadiah sudah diberikan ke member.`)) {
            return;
        }

        setProcessing(redemption.id);
        const result = await completeRedemption(redemption.id);
        setProcessing(null);

        if (result.success) {
            onRefresh();
        } else {
            alert(result.error);
        }
    };

    const handleDelete = async (redemption: any) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus data penukaran ini? Data yang dihapus tidak dapat dikembalikan.`)) {
            return;
        }

        setProcessing(redemption.id);
        const result = await deleteRedemption(redemption.id);
        setProcessing(null);

        if (result.success) {
            onRefresh();
        } else {
            alert(result.error);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { color: string; label: string }> = {
            pending: { color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400", label: "Pending" },
            approved: { color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400", label: "Approved" },
            rejected: { color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", label: "Rejected" },
            completed: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", label: "Completed" },
        };

        const badge = badges[status] || badges.pending;
        return (
            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${badge.color}`}>
                {badge.label}
            </span>
        );
    };

    return (
        <>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Member
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Reward
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Points
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Status
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
                        {redemptions.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                                >
                                    Belum ada permintaan penukaran
                                </td>
                            </tr>
                        ) : (
                            redemptions.map((redemption) => (
                                <tr
                                    key={redemption.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {redemption.member.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {redemption.member.memberId}
                                            </p>
                                            <WhatsAppButton
                                                phone={redemption.member.phone}
                                                message={`Halo ${redemption.member.name}, penukaran reward Anda "${redemption.catalog.name}" telah disetujui. Silakan ambil hadiah Anda.`}
                                                variant="compact"
                                                label="WhatsApp"
                                                className="mt-1"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {redemption.catalog.name}
                                            </p>
                                            {redemption.catalog.category && (
                                                <span className="mt-1 inline-block text-xs text-gray-500 dark:text-gray-400">
                                                    {redemption.catalog.category}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-brand-600 dark:text-brand-400">
                                        {redemption.pointsUsed.toLocaleString("id-ID")} pts
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        {new Date(redemption.redeemedAt).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        {getStatusBadge(redemption.status)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {redemption.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(redemption)}
                                                        disabled={processing === redemption.id}
                                                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50 disabled:opacity-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedRedemption(redemption);
                                                            setShowRejectModal(true);
                                                        }}
                                                        disabled={processing === redemption.id}
                                                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {redemption.status === "approved" && (
                                                <button
                                                    onClick={() => handleComplete(redemption)}
                                                    disabled={processing === redemption.id}
                                                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                    title="Mark as Completed"
                                                >
                                                    <Package className="h-4 w-4" />
                                                    Complete
                                                </button>
                                            )}
                                            {/* Delete button available for all finished statuses */}
                                            {["completed", "rejected", "approved"].includes(redemption.status) && (
                                                <button
                                                    onClick={() => handleDelete(redemption)}
                                                    disabled={processing === redemption.id}
                                                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
                                                    title="Delete"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Reject Modal */}
            {showRejectModal && selectedRedemption && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setShowRejectModal(false)}
                >
                    <div
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Reject Redemption
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Member: {selectedRedemption.member.name}
                            <br />
                            Reward: {selectedRedemption.catalog.name}
                        </p>

                        <div className="mt-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Alasan Penolakan
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                placeholder="Jelaskan alasan penolakan..."
                                required
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setSelectedRedemption(null);
                                    setRejectReason("");
                                }}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={processing === selectedRedemption.id || !rejectReason.trim()}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
                            >
                                {processing === selectedRedemption.id ? "Processing..." : "Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
