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

    // Retry logic for unstable connections
    let lastError: any;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Ensure end date covers the full day
            end.setHours(23, 59, 59, 999);

            // Query the store transaction source table
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
            console.warn(`Attempt ${attempt} failed to query store database:`, error);
            lastError = error;
            if (attempt < 3) {
                // Wait before retrying (exponential backoff: 1s, 2s)
                await new Promise(resolve => setTimeout(resolve, attempt * 1000));
            }
        }
    }

    console.error("Failed to query store database after 3 attempts:", lastError);
    throw new Error(`Gagal mengambil data dari database toko (Connection Error): ${lastError?.message || 'Unknown error'}`);
}
