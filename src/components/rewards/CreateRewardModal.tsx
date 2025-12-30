"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createRewardCatalog, updateRewardCatalog } from "@/app/actions/reward-catalog";

interface CreateRewardModalProps {
    catalog?: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateRewardModal({
    catalog,
    onClose,
    onSuccess,
}: CreateRewardModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        pointsRequired: "",
        stock: "",
        category: "",
        imageUrl: "",
        validUntil: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (catalog) {
            setFormData({
                name: catalog.name || "",
                description: catalog.description || "",
                pointsRequired: catalog.pointsRequired?.toString() || "",
                stock: catalog.stock?.toString() || "",
                category: catalog.category || "",
                imageUrl: catalog.imageUrl || "",
                validUntil: catalog.validUntil
                    ? new Date(catalog.validUntil).toISOString().split("T")[0]
                    : "",
            });
        }
    }, [catalog]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.name || !formData.pointsRequired) {
            setError("Nama dan poin required wajib diisi");
            return;
        }

        setLoading(true);

        const data = {
            name: formData.name,
            description: formData.description || undefined,
            pointsRequired: parseFloat(formData.pointsRequired),
            stock: formData.stock ? parseInt(formData.stock) : undefined,
            category: formData.category || undefined,
            imageUrl: formData.imageUrl || undefined,
            validUntil: formData.validUntil ? new Date(formData.validUntil) : undefined,
        };

        const result = catalog
            ? await updateRewardCatalog(catalog.id, data)
            : await createRewardCatalog(data);

        setLoading(false);

        if (result.success) {
            onSuccess();
        } else {
            setError(result.error || "Gagal menyimpan reward");
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl rounded-xl bg-white shadow-xl dark:bg-gray-900"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {catalog ? "Edit Reward" : "Tambah Reward Baru"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nama Reward <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                placeholder="Contoh: Voucher Belanja Rp 50.000"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Deskripsi
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                placeholder="Detail reward..."
                            />
                        </div>

                        {/* Points & Stock */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Poin Required <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.pointsRequired}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            pointsRequired: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="10"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) =>
                                        setFormData({ ...formData, stock: e.target.value })
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="Kosongkan untuk unlimited"
                                    min="0"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Kosongkan untuk stock unlimited
                                </p>
                            </div>
                        </div>

                        {/* Category & Valid Until */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Kategori
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="">-- Pilih Kategori --</option>
                                    <option value="voucher">Voucher</option>
                                    <option value="discount">Discount</option>
                                    <option value="product">Product</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Valid Until
                                </label>
                                <input
                                    type="date"
                                    value={formData.validUntil}
                                    onChange={(e) =>
                                        setFormData({ ...formData, validUntil: e.target.value })
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Kosongkan jika tidak ada batas waktu
                                </p>
                            </div>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Image URL
                            </label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, imageUrl: e.target.value })
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
                        >
                            {loading ? "Menyimpan..." : catalog ? "Update" : "Tambah"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
