import { Crown, Trophy, Calendar, TrendingUp } from "lucide-react";
import Image from "next/image";

interface ActiveCampaignProps {
    data: {
        name: string;
        endDate: Date;
        leader: {
            name: string;
            score: number;
            metric: string;
        } | null;
    } | null;
}

export default function ActiveCampaignCard({ data }: ActiveCampaignProps) {
    if (!data) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                        <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Campaign Aktif
                        </h3>
                        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                            Tidak ada campaign
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const daysLeft = Math.ceil(
        (new Date(data.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Campaign Bulan Ini
                </h3>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Aktif
                </span>
            </div>

            <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">Nama Campaign</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                    {data.name}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-brand-50 p-4 dark:bg-brand-900/10">
                    <div className="mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                        <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                            Sisa Waktu
                        </span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {daysLeft} <span className="text-xs font-normal text-gray-500">Hari</span>
                    </p>
                </div>

                <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/10">
                    <div className="mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                            Kandidat Juara
                        </span>
                    </div>
                    {data.leader ? (
                        <div>
                            <p className="truncate text-sm font-bold text-gray-900 dark:text-white" title={data.leader.name}>
                                {data.leader.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {data.leader.score.toLocaleString('id-ID')} {data.leader.metric}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm font-medium text-gray-500">-</p>
                    )}
                </div>
            </div>
        </div>
    );
}
