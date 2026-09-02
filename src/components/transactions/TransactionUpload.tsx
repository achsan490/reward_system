"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadTransactions } from "@/app/actions/transaction";
import { calculatePoints, parseCSV } from "@/lib/pointCalculator";

interface ParsedPreview {
    memberId: string;
    memberName: string;
    phone?: string;
    transactionDate: string;
    amount: number;
}

export default function TransactionUpload() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<ParsedPreview[]>([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        setSelectedFile(file);
        setMessage(null);

        // Read and parse preview
        try {
            const text = await file.text();
            const parsed = parseCSV(text);
            setPreviewData(parsed);
        } catch (err) {
            console.error("Gagal membaca preview CSV:", err);
            setPreviewData([]);
        }
    };

    const handleConfirmUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("file", selectedFile);

        const result = await uploadTransactions(formData);

        setUploading(false);

        if (result.success) {
            setMessage({ type: "success", text: result.message || "Berhasil menambahkan data transaksi ke sistem!" });
            setSelectedFile(null);
            setPreviewData([]);
        } else {
            setMessage({ type: "error", text: result.error || "Gagal mengunggah data transaksi" });
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewData([]);
        setMessage(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "text/csv": [".csv"],
        },
        maxFiles: 1,
        disabled: uploading,
    });

    const totalAmount = previewData.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-dark">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Upload Data Transaksi CSV
            </h3>

            {!selectedFile ? (
                <div
                    {...getRootProps()}
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                        isDragActive
                            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/10"
                            : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
                    } ${uploading ? "cursor-not-allowed opacity-50" : ""}`}
                >
                    <input {...getInputProps()} />

                    <div className="flex flex-col items-center gap-2">
                        <svg
                            className="h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>

                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Pilih atau Drag & Drop File CSV Transaksi
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Format kolom: member_id, member_name, phone, transaction_date, amount
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Selected File Banner */}
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-brand-200 bg-brand-50/50 p-4 dark:border-brand-800 dark:bg-brand-950/20">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-white">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {(selectedFile.size / 1024).toFixed(1)} KB • {previewData.length} baris transaksi terdeteksi
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={uploading}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Batal / Ganti File
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmUpload}
                                disabled={uploading || previewData.length === 0}
                                className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {uploading ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Menyimpan ke Database...
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Tambah Data ke Sistem ({previewData.length})
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Preview Table */}
                    {previewData.length > 0 && (
                        <div className="rounded-lg border border-gray-200 overflow-hidden dark:border-gray-700">
                            <div className="bg-gray-50 px-4 py-2.5 flex justify-between items-center text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                <span>Preview Data Transaksi (Total Belanja: Rp {totalAmount.toLocaleString("id-ID")})</span>
                                <span className="text-brand-600 dark:text-brand-400">Belum disimpan ke database</span>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                <table className="w-full text-left text-xs text-gray-600 dark:text-gray-400">
                                    <thead className="bg-gray-100 text-gray-700 uppercase dark:bg-gray-750 dark:text-gray-300 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2">ID Member</th>
                                            <th className="px-3 py-2">Nama Member</th>
                                            <th className="px-3 py-2">No. Telepon</th>
                                            <th className="px-3 py-2">Tanggal</th>
                                            <th className="px-3 py-2 text-right">Total Belanja</th>
                                            <th className="px-3 py-2 text-right">Estimasi Poin</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {previewData.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-3 py-2 font-mono font-medium text-gray-900 dark:text-white">{item.memberId}</td>
                                                <td className="px-3 py-2">{item.memberName}</td>
                                                <td className="px-3 py-2">{item.phone || "-"}</td>
                                                <td className="px-3 py-2">{item.transactionDate}</td>
                                                <td className="px-3 py-2 text-right font-medium text-gray-900 dark:text-white">
                                                    Rp {item.amount.toLocaleString("id-ID")}
                                                </td>
                                                <td className="px-3 py-2 text-right font-semibold text-brand-600 dark:text-brand-400">
                                                    +{calculatePoints(item.amount)} pts
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {message && (
                <div
                    className={`mt-4 rounded-lg p-4 ${
                        message.type === "success"
                            ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                >
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Format Kolom CSV yang Didukung:
                </h4>
                <pre className="overflow-x-auto text-xs text-gray-600 dark:text-gray-400">
                    {`member_id,member_name,phone,transaction_date,amount
M0001,Ahmad Fauzi,081234567890,2026-09-01,150000
M0002,Siti Nurhaliza,082345678901,2026-09-01,275000`}
                </pre>
            </div>
        </div>
    );
}

