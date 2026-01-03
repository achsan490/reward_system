// Dummy data generator untuk simulasi database toko
// Nanti bisa diganti dengan koneksi database real

export interface StoreTransaction {
    memberId: string;
    memberName: string;
    transactionDate: Date;
    amount: number;
    phone?: string;
}

/**
 * Generate dummy transactions untuk simulasi database toko
 * Nanti fungsi ini akan diganti dengan query ke database toko real
 */
export function generateDummyStoreTransactions(
    startDate: Date,
    endDate: Date
): StoreTransaction[] {
    const transactions: StoreTransaction[] = [];

    // Dummy member data
    const members = [
        { id: "M001", name: "Budi Santoso", phone: "081234567890" },
        { id: "M002", name: "Siti Nurhaliza", phone: "081234567891" },
        { id: "M003", name: "Ahmad Dahlan", phone: "081234567892" },
        { id: "M004", name: "Dewi Sartika", phone: "081234567893" },
        { id: "M005", name: "Rudi Hartono", phone: "081234567894" },
        { id: "M006", name: "Ani Yudhoyono", phone: "081234567895" },
        { id: "M007", name: "Joko Widodo", phone: "081234567896" },
        { id: "M008", name: "Mega Wati", phone: "081234567897" },
        { id: "M009", name: "Prabowo Subianto", phone: "081234567898" },
        { id: "M010", name: "Sri Mulyani", phone: "081234567899" },
    ];

    // Generate random transactions dalam rentang tanggal
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Reset time to start of day for accurate comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const currentDate = new Date(start);

    while (currentDate <= end) {
        // Random 2-5 transaksi per hari
        const transactionsPerDay = Math.floor(Math.random() * 4) + 2;

        for (let i = 0; i < transactionsPerDay; i++) {
            const randomMember = members[Math.floor(Math.random() * members.length)];

            // Random amount between 50,000 - 500,000
            const amount = Math.floor(Math.random() * 450000) + 50000;

            // Random time dalam hari tersebut
            const transactionTime = new Date(currentDate);
            transactionTime.setHours(
                Math.floor(Math.random() * 12) + 8, // 8 AM - 8 PM
                Math.floor(Math.random() * 60),
                Math.floor(Math.random() * 60)
            );

            transactions.push({
                memberId: randomMember.id,
                memberName: randomMember.name,
                transactionDate: new Date(transactionTime),
                amount: amount,
                phone: randomMember.phone,
            });
        }

        // Next day - create new Date to avoid mutation issues
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return transactions;
}

/**
 * Simulasi query ke database toko
 * Nanti akan diganti dengan:
 * - Connection ke database toko (MySQL/PostgreSQL/dll)
 * - Query dengan WHERE date BETWEEN startDate AND endDate
 */
export async function queryStoreDatabaseDummy(
    startDate: string,
    endDate: string
): Promise<StoreTransaction[]> {
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 1000));

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Generate dummy data
    const transactions = generateDummyStoreTransactions(start, end);

    return transactions;
}
