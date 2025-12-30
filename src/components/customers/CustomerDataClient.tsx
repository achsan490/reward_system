"use client";

import { useState, useCallback } from "react";
import { searchCustomers } from "@/app/actions/customers";
import CustomerTable from "@/components/customers/CustomerTable";
import CustomerSearch from "@/components/customers/CustomerSearch";
import ExportCustomersButton from "@/components/customers/ExportCustomersButton";

interface Customer {
    id: string;
    memberId: string;
    name: string;
    email: string | null;
    phone: string | null;
    totalPoints: number;
    totalSpent: number;
    transactionCount: number;
}

interface CustomerDataClientProps {
    initialCustomers: Customer[];
}

export default function CustomerDataClient({
    initialCustomers,
}: CustomerDataClientProps) {
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = useCallback(async (query: string) => {
        setIsSearching(true);
        const result = await searchCustomers(query);
        if (result.success && result.data) {
            setCustomers(result.data as Customer[]);
        }
        setIsSearching(false);
    }, []);

    return (
        <div className="space-y-6">
            {/* Search and Actions Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CustomerSearch onSearch={handleSearch} />
                <ExportCustomersButton />
            </div>

            {/* Loading State */}
            {isSearching && (
                <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
                </div>
            )}

            {/* Customer Table */}
            {!isSearching && <CustomerTable customers={customers} />}

            {/* Results Count */}
            {!isSearching && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Menampilkan {customers.length} pelanggan
                </p>
            )}
        </div>
    );
}
