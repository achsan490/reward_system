"use client";

import { useState, useEffect } from "react";
import { Download, QrCode } from "lucide-react";
import { getAllMembersForGeneration, generateMemberQRCode } from "@/app/actions/member-portal";

export default function QRGeneratorContent() {
    const [members, setMembers] = useState<any[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAllMembersForGeneration().then((result) => {
            if (result.success && result.data) {
                setMembers(result.data);
            }
        });
    }, []);

    const handleGenerate = async () => {
        if (!selectedMemberId) return;

        setLoading(true);
        const result = await generateMemberQRCode(selectedMemberId);
        setLoading(false);

        if (result.success && result.data) {
            setQrCodeData(result.data.qrCodeDataUrl);
        }
    };

    const handleDownload = () => {
        if (!qrCodeData) return;

        const link = document.createElement("a");
        link.href = qrCodeData;
        link.download = `QR-${selectedMemberId}.png`;
        link.click();
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Generator Form */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Generate QR Code
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Pilih Member
                        </label>
                        <select
                            value={selectedMemberId}
                            onChange={(e) => setSelectedMemberId(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="">-- Pilih Member --</option>
                            {members.map((member) => (
                                <option key={member.id} value={member.memberId}>
                                    {member.name} ({member.memberId})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!selectedMemberId || loading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
                    >
                        <QrCode className="h-5 w-5" />
                        {loading ? "Generating..." : "Generate QR Code"}
                    </button>
                </div>
            </div>

            {/* QR Code Preview */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Preview QR Code
                </h3>

                {qrCodeData ? (
                    <div className="space-y-4">
                        <div className="flex justify-center rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
                            <img
                                src={qrCodeData}
                                alt="QR Code"
                                className="h-64 w-64"
                            />
                        </div>

                        <button
                            onClick={handleDownload}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <Download className="h-5 w-5" />
                            Download QR Code
                        </button>

                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                💡 Member bisa scan QR code ini untuk langsung cek poin mereka!
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
                        <p className="text-gray-500 dark:text-gray-400">
                            QR Code akan muncul di sini
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
