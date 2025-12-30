"use client";

import { useState, useEffect } from "react";
import { Plus, Gift, TrendingUp, Package, AlertCircle } from "lucide-react";
import { getAllRewardCatalogs, getRewardCatalogStats } from "@/app/actions/reward-catalog";
import RewardCatalogTable from "./RewardCatalogTable";
import CreateRewardModal from "./CreateRewardModal";

export default function RewardCatalogContent() {
    const [catalogs, setCatalogs] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCatalog, setEditingCatalog] = useState<any>(null);

    const loadData = async () => {
        setLoading(true);
        const [catalogsResult, statsResult] = await Promise.all([
            getAllRewardCatalogs(true), // Include inactive
            getRewardCatalogStats(),
        ]);

        if (catalogsResult.success) {
            setCatalogs(catalogsResult.data || []);
        }
        if (statsResult.success) {
            setStats(statsResult.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        setEditingCatalog(null);
        loadData();
    };

    const handleEdit = (catalog: any) => {
        setEditingCatalog(catalog);
        setShowCreateModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/40">
                                <Gift className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Total Rewards
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.totalCatalogs}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/40">
                                <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Active Rewards
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.activeCatalogs}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/40">
                                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Total Redemptions
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.totalRedemptions}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/40">
                                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Pending Requests
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.pendingRedemptions}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => {
                        setEditingCatalog(null);
                        setShowCreateModal(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
                >
                    <Plus className="h-5 w-5" />
                    Tambah Reward
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
                </div>
            ) : (
                <RewardCatalogTable
                    catalogs={catalogs}
                    onEdit={handleEdit}
                    onRefresh={loadData}
                />
            )}

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <CreateRewardModal
                    catalog={editingCatalog}
                    onClose={() => {
                        setShowCreateModal(false);
                        setEditingCatalog(null);
                    }}
                    onSuccess={handleCreateSuccess}
                />
            )}
        </div>
    );
}
