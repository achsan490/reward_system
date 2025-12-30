import { Metadata } from "next";
import { getCustomers, getCustomerStats } from "@/app/actions/customers";
import CustomerStats from "@/components/customers/CustomerStats";
import CustomerDataClient from "@/components/customers/CustomerDataClient";

export const metadata: Metadata = {
    title: "Data Pelanggan | Reward System",
    description: "Kelola data pelanggan dan poin reward",
};

export default async function CustomersPage() {
    const [customersResult, statsResult] = await Promise.all([
        getCustomers(),
        getCustomerStats(),
    ]);

    const customers = customersResult.success ? customersResult.data : [];
    const stats = statsResult.success
        ? statsResult.data
        : {
            totalCustomers: 0,
            totalPoints: 0,
            totalSpent: 0,
            avgTransactionsPerCustomer: 0,
        };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Data Pelanggan
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Kelola database pelanggan dan lihat statistik reward
                </p>
            </div>

            {/* Statistics Cards */}
            {stats && <CustomerStats stats={stats} />}

            {/* Customer Data */}
            <CustomerDataClient initialCustomers={customers || []} />
        </div>
    );
}
