"use server";

import { prisma } from "@/lib/prisma";

/**
 * Get customer statistics
 */
export async function getCustomerStats() {
    try {
        const [totalCustomers, statsAggregation] = await Promise.all([
            prisma.member.count(),
            prisma.member.aggregate({
                _sum: {
                    totalPoints: true,
                    totalSpent: true,
                    transactionCount: true,
                },
            }),
        ]);

        const totalPoints = statsAggregation._sum.totalPoints || 0;
        const totalSpent = statsAggregation._sum.totalSpent || 0;
        const totalTransactions = statsAggregation._sum.transactionCount || 0;
        const avgTransactionsPerCustomer =
            totalCustomers > 0 ? totalTransactions / totalCustomers : 0;

        return {
            success: true,
            data: {
                totalCustomers,
                totalPoints,
                totalSpent,
                avgTransactionsPerCustomer,
            },
        };
    } catch (error) {
        console.error("Error getting customer stats:", error);
        return {
            success: false,
            error: "Failed to fetch customer statistics",
        };
    }
}

/**
 * Get all customers with optional sorting
 */
export async function getCustomers(params?: {
    sortBy?: "name" | "totalPoints" | "totalSpent" | "transactionCount";
    sortOrder?: "asc" | "desc";
}) {
    try {
        const sortBy = params?.sortBy || "name";
        const sortOrder = params?.sortOrder || "asc";

        const customers = await prisma.member.findMany({
            orderBy: {
                [sortBy]: sortOrder,
            },
            select: {
                id: true,
                memberId: true,
                name: true,
                email: true,
                phone: true,
                totalPoints: true,
                totalSpent: true,
                transactionCount: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return { success: true, data: customers };
    } catch (error) {
        console.error("Error getting customers:", error);
        return { success: false, error: "Failed to fetch customers" };
    }
}

/**
 * Search customers by name, email, or member ID
 */
export async function searchCustomers(query: string) {
    try {
        if (!query || query.trim() === "") {
            return getCustomers();
        }

        const customers = await prisma.member.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { email: { contains: query } },
                    { memberId: { contains: query } },
                    { phone: { contains: query } },
                ],
            },
            select: {
                id: true,
                memberId: true,
                name: true,
                email: true,
                phone: true,
                totalPoints: true,
                totalSpent: true,
                transactionCount: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return { success: true, data: customers };
    } catch (error) {
        console.error("Error searching customers:", error);
        return { success: false, error: "Failed to search customers" };
    }
}

/**
 * Get customer by ID with transaction history
 */
export async function getCustomerById(id: string) {
    try {
        const customer = await prisma.member.findUnique({
            where: { id },
            include: {
                transactions: {
                    orderBy: { transactionDate: "desc" },
                    take: 50, // Limit to last 50 transactions
                },
            },
        });

        if (!customer) {
            return { success: false, error: "Customer not found" };
        }

        return { success: true, data: customer };
    } catch (error) {
        console.error("Error getting customer:", error);
        return { success: false, error: "Failed to fetch customer details" };
    }
}

/**
 * Export customers data to CSV format
 */
export async function exportCustomersToCSV() {
    try {
        const customers = await prisma.member.findMany({
            orderBy: { name: "asc" },
            select: {
                memberId: true,
                name: true,
                email: true,
                phone: true,
                totalPoints: true,
                totalSpent: true,
                transactionCount: true,
                createdAt: true,
            },
        });

        // Create CSV header
        const header = [
            "Member ID",
            "Nama",
            "Email",
            "Telepon",
            "Total Points",
            "Total Belanja",
            "Jumlah Transaksi",
            "Tanggal Bergabung",
        ].join(",");

        // Create CSV rows
        const rows = customers.map((customer) => {
            return [
                customer.memberId,
                `"${customer.name}"`, // Wrap in quotes to handle commas in names
                customer.email || "",
                customer.phone || "",
                customer.totalPoints,
                customer.totalSpent,
                customer.transactionCount,
                new Date(customer.createdAt).toLocaleDateString("id-ID"),
            ].join(",");
        });

        // Combine header and rows
        const csv = [header, ...rows].join("\n");

        return { success: true, data: csv };
    } catch (error) {
        console.error("Error exporting customers:", error);
        return { success: false, error: "Failed to export customers data" };
    }
}
