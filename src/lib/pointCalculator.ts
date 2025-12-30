/**
 * Calculate points from transaction amount based on conversion rate
 * @param amount - Transaction amount
 * @param conversionRate - Amount needed for 1 point (default: 5000)
 * @returns Points earned
 */
export function calculatePoints(
    amount: number,
    conversionRate: number = 5000
): number {
    return Math.floor(amount / conversionRate);
}

/**
 * Parse CSV content into array of objects
 * Expected format: member_id,member_name,phone,transaction_date,amount
 * Note: phone column is optional for backward compatibility
 */
export function parseCSV(csvContent: string): Array<{
    memberId: string;
    memberName: string;
    phone?: string;
    transactionDate: string;
    amount: number;
}> {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    // Detect column indices
    const memberIdIndex = headers.findIndex(h => h.includes('member_id') || h.includes('memberid'));
    const memberNameIndex = headers.findIndex(h => h.includes('member_name') || h.includes('membername') || h.includes('name'));
    const phoneIndex = headers.findIndex(h => h.includes('phone') || h.includes('whatsapp') || h.includes('wa'));
    const dateIndex = headers.findIndex(h => h.includes('transaction_date') || h.includes('date'));
    const amountIndex = headers.findIndex(h => h.includes('amount') || h.includes('total'));

    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());

        if (values.length < 4) {
            continue; // Skip invalid rows
        }

        const row: {
            memberId: string;
            memberName: string;
            phone?: string;
            transactionDate: string;
            amount: number;
        } = {
            memberId: values[memberIdIndex] || '',
            memberName: values[memberNameIndex] || '',
            transactionDate: values[dateIndex] || '',
            amount: parseFloat(values[amountIndex] || '0')
        };

        // Add phone if column exists and has value
        if (phoneIndex !== -1 && values[phoneIndex]) {
            row.phone = values[phoneIndex];
        }

        // Validate required data
        if (row.memberId && row.memberName && row.transactionDate && !isNaN(row.amount)) {
            data.push(row);
        }
    }

    return data;
}

/**
 * Format currency to Rupiah
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('id-ID').format(num);
}
