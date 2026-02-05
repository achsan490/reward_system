import { Trophy, Medal } from "lucide-react";

interface Winner {
    rank: number;
    name: string;
    points: number;
    campaignName: string;
}

interface HallOfFameProps {
    winners: Winner[];
}

export default function HallOfFameCard({ winners }: HallOfFameProps) {
    if (winners.length === 0) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900/20">
                        <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Hall of Fame</h3>
                </div>
                <p className="text-sm text-center text-gray-500 py-4">Belum ada pemenang sebelumnya.</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900/20">
                        <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Hall of Fame</h3>
                        <p className="text-xs text-gray-500">{winners[0].campaignName}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {winners.map((winner) => (
                    <div
                        key={winner.rank}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${winner.rank === 1
                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                        : winner.rank === 2
                                            ? "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                            : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                    }`}
                            >
                                #{winner.rank}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {winner.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {winner.points.toLocaleString("id-ID")} Poin
                                </p>
                            </div>
                        </div>
                        {winner.rank === 1 && (
                            <Medal className="h-5 w-5 text-yellow-500" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
