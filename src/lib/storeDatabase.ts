import { prisma } from "@/lib/prisma";

export interface StoreTransaction {
    memberId: string;
    memberName: string;
    transactionDate: Date;
    amount: number;
    phone?: string;
}

/**
 * Fetch transactions from the Store Database (POS System)
 * 
 * This function queries the StoreTransactionSource table which acts as a
 * bridge to the external POS database. Currently, it queries our own database
 * table that simulates the POS system, but can be replaced with actual
 * external API calls or direct database connections in production.
 * 
 * @param startDate - Start date for transaction query (YYYY-MM-DD format)
 * @param endDate - End date for transaction query (YYYY-MM-DD format)
 * @returns Promise array of StoreTransaction objects
 */
export async function queryStoreDatabase(
    startDate: string,
    endDate: string
): Promise<StoreTransaction[]> {
    // Simulate network delay to mimic real external API/database connection
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Ensure end date covers the full day
        end.setHours(23, 59, 59, 999);

        // Query the store transaction source table
        // NOTE: In production, this could be replaced with:
        // - External API call to POS system
        // - Direct connection to external POS database
        // - Message queue consumer from POS events
        const transactions = await prisma.storeTransactionSource.findMany({
            where: {
                transactionDate: {
                    gte: start,
                    lte: end
                }
            },
            orderBy: {
                transactionDate: 'desc'
            }
        });

        // Transform to application format
        return transactions.map(txn => ({
            memberId: txn.memberId,
            memberName: txn.memberName,
            transactionDate: txn.transactionDate,
            amount: txn.amount,
            phone: txn.phone || undefined
        }));

    } catch (error) {
        console.error("Failed to query store database:", error);
        throw new Error("Gagal mengambil data dari database toko (Connection Error)");
    }
}
