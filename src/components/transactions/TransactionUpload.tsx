"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadTransactions } from "@/app/actions/transaction";

export default function TransactionUpload() {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadTransactions(formData);

        setUploading(false);

        if (result.success) {
            setMessage({ type: "success", text: result.message || "Upload successful!" });
        } else {
            setMessage({ type: "error", text: result.error || "Upload failed" });
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "text/csv": [".csv"],
        },
        maxFiles: 1,
        disabled: uploading,
    });

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-dark">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Upload Data Transaksi
            </h3>

            <div
                {...getRootProps()}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragActive
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

                    {uploading ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Memproses file...
                        </p>
                    ) : isDragActive ? (
                        <p className="text-sm text-brand-600 dark:text-brand-400">
                            Drop file di sini...
                        </p>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Drag & drop file CSV atau klik untuk memilih
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                Format: member_id, member_name, transaction_date, amount
                            </p>
                        </>
                    )}
                </div>
            </div>

            {message && (
                <div
                    className={`mt-4 rounded-lg p-4 ${message.type === "success"
                            ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                >
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Contoh Format CSV:
                </h4>
                <pre className="overflow-x-auto text-xs text-gray-600 dark:text-gray-400">
                    {`member_id,member_name,transaction_date,amount
M001,John Doe,2025-01-15,50000
M002,Jane Smith,2025-01-16,125000
M001,John Doe,2025-01-17,75000`}
                </pre>
            </div>
        </div>
    );
}
