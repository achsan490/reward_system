"use client";

import { X, Calendar, Award } from "lucide-react";
import { useState } from "react";
import { createRewardCampaign } from "@/app/actions/rewards";
import { useRouter } from "next/navigation";

interface CreateCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateCampaignModal({
    isOpen,
    onClose,
}: CreateCampaignModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        criteria: "top_points" as "top_points" | "top_spending" | "top_transactions",
        winnersCount: 10,
        startDate: "",
        endDate: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await createRewardCampaign({
                name: formData.name,
                description: formData.description || undefined,
                criteria: formData.criteria,
                winnersCount: formData.winnersCount,
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate),
            });

            if (result.success) {
                onClose();
                router.refresh();
                // Reset form
                setFormData({
                    name: "",
                    description: "",
                    criteria: "top_points",
                    winnersCount: 10,
                    startDate: "",
                    endDate: "",
                });
            } else {
                setError(result.error || "Gagal membuat campaign");
            }
        } catch (err) {
            setError("Terjadi kesalahan saat membuat campaign");
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 pt-8"
            onClick={handleBackdropClick}
        >
            <div
                className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl dark:bg-gray-900"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Buat Campaign Reward Baru
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Campaign Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Nama Campaign *
                            </label>
                            <input
                                type="text"
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-400"
                                placeholder="Contoh: Reward Bulanan Januari 2025"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Deskripsi
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-400"
                                placeholder="Deskripsi campaign reward..."
                            />
                        </div>

                        {/* Criteria */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Kriteria Pemenang *
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center rounded-lg border border-gray-300 p-4 cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                                    <input
                                        type="radio"
                                        name="criteria"
                                        value="top_points"
                                        checked={
                                            formData.criteria === "top_points"
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                criteria: e.target.value as any,
                                            })
                                        }
                                        className="h-4 w-4 text-brand-600 focus:ring-2 focus:ring-brand-500"
                                    />
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            Top Points
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Member dengan poin tertinggi
                                        </p>
                                    </div>
                                </label>

                                <label className="flex items-center rounded-lg border border-gray-300 p-4 cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                                    <input
                                        type="radio"
                                        name="criteria"
                                        value="top_spending"
                                        checked={
                                            formData.criteria === "top_spending"
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                criteria: e.target.value as any,
                                            })
                                        }
                                        className="h-4 w-4 text-brand-600 focus:ring-2 focus:ring-brand-500"
                                    />
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            Top Spending
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Member dengan total belanja terbesar
                                        </p>
                                    </div>
                                </label>

                                <label className="flex items-center rounded-lg border border-gray-300 p-4 cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                                    <input
                                        type="radio"
                                        name="criteria"
                                        value="top_transactions"
                                        checked={
                                            formData.criteria ===
                                            "top_transactions"
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                criteria: e.target.value as any,
                                            })
                                        }
                                        className="h-4 w-4 text-brand-600 focus:ring-2 focus:ring-brand-500"
                                    />
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            Top Transactions
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Member dengan transaksi terbanyak
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Winners Count */}
                        <div>
                            <label
                                htmlFor="winnersCount"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Jumlah Pemenang *
                            </label>
                            <input
                                type="number"
                                id="winnersCount"
                                required
                                min="1"
                                max="100"
                                value={formData.winnersCount || ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                        ...formData,
                                        winnersCount: value === "" ? 0 : parseInt(value),
                                    });
                                }}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-400"
                            />
                        </div>

                        {/* Date Range */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="startDate"
                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Tanggal Mulai *
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    required
                                    value={formData.startDate}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            startDate: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-400"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="endDate"
                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Tanggal Selesai *
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    required
                                    value={formData.endDate}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            endDate: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <Award className="h-4 w-4" />
                                    Buat Campaign
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
