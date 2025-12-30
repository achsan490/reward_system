/**
 * Utility functions for point expiration calculations
 */

/**
 * Calculate expiry date based on transaction date and expiration days
 * @param transactionDate - Date of the transaction
 * @param expirationDays - Number of days until expiration
 * @returns Expiry date
 */
export function calculateExpiryDate(
    transactionDate: Date,
    expirationDays: number
): Date {
    const expiryDate = new Date(transactionDate);
    expiryDate.setDate(expiryDate.getDate() + expirationDays);
    return expiryDate;
}

/**
 * Check if points are expiring soon within threshold days
 * @param expiryDate - Expiry date of points
 * @param thresholdDays - Number of days to consider as "soon"
 * @returns True if expiring within threshold
 */
export function isExpiringSoon(
    expiryDate: Date | null | undefined,
    thresholdDays: number = 30
): boolean {
    if (!expiryDate) return false;

    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 && diffDays <= thresholdDays;
}

/**
 * Check if points have already expired
 * @param expiryDate - Expiry date of points
 * @returns True if expired
 */
export function isExpired(expiryDate: Date | null | undefined): boolean {
    if (!expiryDate) return false;

    const now = new Date();
    return expiryDate.getTime() < now.getTime();
}

/**
 * Get number of days until expiry
 * @param expiryDate - Expiry date of points
 * @returns Number of days remaining (negative if expired)
 */
export function getDaysUntilExpiry(expiryDate: Date | null | undefined): number {
    if (!expiryDate) return Infinity;

    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

/**
 * Format expiry warning message
 * @param daysRemaining - Days until expiry
 * @returns User-friendly warning message
 */
export function formatExpiryWarning(daysRemaining: number): string {
    if (daysRemaining < 0) {
        return "Sudah kadaluarsa";
    } else if (daysRemaining === 0) {
        return "Kadaluarsa hari ini!";
    } else if (daysRemaining === 1) {
        return "Kadaluarsa besok!";
    } else if (daysRemaining <= 7) {
        return `Kadaluarsa dalam ${daysRemaining} hari`;
    } else if (daysRemaining <= 30) {
        return `Kadaluarsa dalam ${daysRemaining} hari`;
    } else {
        return `Kadaluarsa dalam ${daysRemaining} hari`;
    }
}

/**
 * Get urgency level based on days remaining
 * @param daysRemaining - Days until expiry
 * @returns Urgency level: 'critical' | 'warning' | 'normal' | 'expired'
 */
export function getUrgencyLevel(
    daysRemaining: number
): "critical" | "warning" | "normal" | "expired" {
    if (daysRemaining < 0) {
        return "expired";
    } else if (daysRemaining <= 7) {
        return "critical";
    } else if (daysRemaining <= 30) {
        return "warning";
    } else {
        return "normal";
    }
}

/**
 * Format date to Indonesian locale
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateID(date: Date | null | undefined): string {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Format date to short Indonesian locale
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateShortID(date: Date | null | undefined): string {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
