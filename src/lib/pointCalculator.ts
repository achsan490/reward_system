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
    // Handle both Windows and Unix line endings
    const lines = csvContent.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''));

    // Detect column indices
    const memberIdIndex = headers.findIndex(h => h.includes('member_id') || h.includes('memberid'));
    const memberNameIndex = headers.findIndex(h => h.includes('member_name') || h.includes('membername') || h.includes('name'));
    const phoneIndex = headers.findIndex(h => h.includes('phone') || h.includes('whatsapp') || h.includes('wa'));
    const dateIndex = headers.findIndex(h => h.includes('transaction_date') || h.includes('date'));
    const amountIndex = headers.findIndex(h => h.includes('amount') || h.includes('total'));

    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/["']/g, ''));

        if (values.length < 2) continue; // Skip empty rows

        // Robust numeric parsing: remove everything except digits and decimal point/comma
        let amountStr = values[amountIndex] || '0';
        // If it looks like IDR (e.g., 10.000,00), convert to JS float (10000.00)
        // First, check if there's a comma that acts as a decimal
        if (amountStr.includes(',') && amountStr.includes('.')) {
            // Likely 1.234,56 style
            amountStr = amountStr.replace(/\./g, '').replace(',', '.');
        } else if (amountStr.includes(',') && !amountStr.includes('.')) {
            // Could be 1234,56 or 1,234. Hard to tell, but usually comma is decimal if only one.
            // But if it's 1.000 it might be thousand.
            // We'll assume if it's followed by 3 digits it might be thousand, but that's risky.
            // Simplified Indonesian common format in CSV often just uses digits or standard float.
            if (amountStr.split(',')[1]?.length === 3) {
                // Likely thousand separator
                amountStr = amountStr.replace(',', '');
            } else {
                amountStr = amountStr.replace(',', '.');
            }
        } else {
            amountStr = amountStr.replace(/[^0-9.-]/g, '');
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
            transactionDate: parseRobustDate(values[dateIndex] || ''),
            amount: parseFloat(amountStr) || 0
        };

        // Add phone if column exists and has value
        if (phoneIndex !== -1 && values[phoneIndex]) {
            row.phone = values[phoneIndex];
        }

        // Validate required data (transactionDate can be flexible)
        if (row.memberId && row.memberName && !isNaN(row.amount)) {
            data.push(row);
        }
    }

    return data;
}

/**
 * Parse date string robustly, handling DD/MM/YYYY and YYYY-MM-DD
 */
function parseRobustDate(dateStr: string): string {
    if (!dateStr) return '';

    // If it's already YYYY-MM-DD, return as is
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr;

    // Handle DD/MM/YYYY or DD-MM-YYYY
    const dmyMatch = dateStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
    if (dmyMatch) {
        const [, day, month, year] = dmyMatch;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return dateStr;
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
