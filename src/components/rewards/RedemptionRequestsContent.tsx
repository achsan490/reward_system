"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Package, Trash2, AlertCircle } from "lucide-react";
import { getAllRedemptions, getRedemptionStats, deleteAllCompletedRedemptions, autoExpireRedemptions } from "@/app/actions/reward-redemption";
import RedemptionRequestsTable from "./RedemptionRequestsTable";

export default function RedemptionRequestsContent() {
    const [redemptions, setRedemptions] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const loadData = async () => {
        setLoading(true);
        // Auto-expire old redemptions first (or in parallel)
        await autoExpireRedemptions();

        const [redemptionsResult, statsResult] = await Promise.all([
            getAllRedemptions(statusFilter !== "all" ? { status: statusFilter } : undefined),
            getRedemptionStats(),
        ]);

        if (redemptionsResult.success) {
            setRedemptions(redemptionsResult.data || []);
        }
        if (statsResult.success) {
            setStats(statsResult.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [statusFilter]);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/40">
                                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Pending
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.pendingRedemptions}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/40">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Approved
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.approvedRedemptions}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/40">
                                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Completed
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.completedRedemptions}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Expired Status Card */}
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/40">
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Expired
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.expiredRedemptions || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/40">
                                <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Points Used
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.totalPointsRedeemed.toLocaleString("id-ID")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter */}
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter:
                </label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                    <option value="all">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                    <option value="expired">Expired</option>
                </select>

                <div className="flex-1"></div>

                {/* Bulk Delete Button */}
                <button
                    onClick={async () => {
                        if (confirm("Apakah Anda yakin ingin menghapus SEMUA data penukaran yang sudah selesai (Completed)? Tindakan ini tidak dapat dibatalkan.")) {
                            setLoading(true);
                            const result = await deleteAllCompletedRedemptions();
                            if (result.success) {
                                alert(result.message);
                                loadData();
                            } else {
                                alert(result.error);
                                setLoading(false);
                            }
                        }
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                    <Trash2 className="h-4 w-4" />
                    Hapus Semua Completed
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
                </div>
            ) : (
                <RedemptionRequestsTable
                    redemptions={redemptions}
                    onRefresh={loadData}
                />
            )}
        </div>
    );
}
