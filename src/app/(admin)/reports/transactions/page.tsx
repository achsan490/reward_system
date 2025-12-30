import { Metadata } from "next";
import { getTransactionAnalysis } from "@/app/actions/reports";
import TransactionAnalysisContent from "@/components/reports/TransactionAnalysisContent";

export const metadata: Metadata = {
    title: "Analisis Transaksi | Reward System",
    description: "Analisis dan insight transaksi member",
};

export default async function TransactionAnalysisPage() {
    const analysisResult = await getTransactionAnalysis();

    const analysisData = analysisResult.success
        ? analysisResult.data
        : {
            trends: [],
            topSpenders: [],
            stats: {
                totalTransactions: 0,
                totalAmount: 0,
                avgTransaction: 0,
                growth: 0,
            },
        };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    📈 Analisis Transaksi
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Insight dan trend transaksi member
                </p>
            </div>

            <TransactionAnalysisContent data={analysisData!} />
        </div>
    );
}
