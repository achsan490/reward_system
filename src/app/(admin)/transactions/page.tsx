import { Metadata } from "next";
import {
    getTopMembers,
    getTransactionStats,
    getTransactions,
} from "@/app/actions/transaction";
import TransactionUpload from "@/components/transactions/TransactionUpload";
import TransactionTable from "@/components/transactions/TransactionTable";

export const metadata: Metadata = {
    title: "Data Transaksi | Reward System",
    description: "Upload dan kelola data transaksi member",
};

export default async function TransactionsPage() {
    // Fetch data
    const [topMembersResult, statsResult, transactionsResult] =
        await Promise.all([
            getTopMembers(10),
            getTransactionStats(),
            getTransactions(1, 20),
        ]);

    const topMembers = topMembersResult.success ? topMembersResult.data ?? [] : [];
    const stats = statsResult.success && statsResult.data
        ? statsResult.data
        : { totalTransactions: 0, totalMembers: 0, totalAmount: 0, totalPoints: 0 };
    const transactions = transactionsResult.success
        ? transactionsResult.data?.transactions ?? []
        : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Data Transaksi
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Upload dan kelola data transaksi member untuk sistem point reward
                </p>
            </div>

            {/* Upload Section */}
            <TransactionUpload />

            {/* Transactions Table */}
            <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                    Riwayat Transaksi
                </h2>
                <TransactionTable transactions={transactions} />
            </div>
        </div>
    );
}
