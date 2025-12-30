"use client";

import { useState, useEffect } from "react";
import { CreditCard, Download } from "lucide-react";
import { getAllMembersForGeneration, getMemberCardData } from "@/app/actions/member-portal";

export default function MemberCardsContent() {
    const [members, setMembers] = useState<any[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [cardData, setCardData] = useState<any>(null);
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
        const result = await getMemberCardData(selectedMemberId);
        setLoading(false);

        if (result.success && result.data) {
            setCardData(result.data);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Generator Form */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Generate Member Card
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
                        <CreditCard className="h-5 w-5" />
                        {loading ? "Generating..." : "Generate Card"}
                    </button>

                    {cardData && (
                        <button
                            onClick={handlePrint}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <Download className="h-5 w-5" />
                            Print Card
                        </button>
                    )}
                </div>
            </div>

            {/* Card Preview */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Preview Card
                </h3>

                {cardData ? (
                    <div className="space-y-4">
                        {/* Member Card */}
                        <div className="overflow-hidden rounded-xl border-2 border-brand-200 bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white shadow-xl">
                            <div className="mb-4">
                                <h4 className="text-sm font-medium opacity-90">REWARD MEMBER CARD</h4>
                            </div>

                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="mb-3">
                                        <p className="text-xs opacity-75">Member ID</p>
                                        <p className="text-lg font-bold">{cardData.member.memberId}</p>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-xs opacity-75">Name</p>
                                        <p className="text-xl font-bold">{cardData.member.name}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs opacity-75">Points</p>
                                            <p className="font-semibold">{cardData.member.totalPoints.toLocaleString("id-ID")}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs opacity-75">Since</p>
                                            <p className="font-semibold">
                                                {new Date(cardData.member.createdAt).getFullYear()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code */}
                                <div className="ml-4 rounded-lg bg-white p-2">
                                    <img
                                        src={cardData.qrCode}
                                        alt="QR Code"
                                        className="h-24 w-24"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                💡 Kartu ini bisa di-print dan diberikan kepada member. QR code bisa di-scan untuk cek poin!
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
                        <p className="text-gray-500 dark:text-gray-400">
                            Card preview akan muncul di sini
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
