/**
 * Format phone number for WhatsApp API
 * Removes all non-digit characters and converts to international format
 * 
 * @param phone - Phone number in any format
 * @returns Clean phone number with country code (62xxx) or null if invalid
 */
export function formatPhoneForWhatsApp(phone: string | null | undefined): string | null {
    if (!phone) return null;

    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // Handle different formats
    if (cleaned.startsWith('62')) {
        // Already has country code
        return cleaned;
    } else if (cleaned.startsWith('0')) {
        // Local format (0xxx) -> convert to international (62xxx)
        return '62' + cleaned.substring(1);
    } else if (cleaned.startsWith('8')) {
        // Missing leading 0 (8xxx) -> add country code
        return '62' + cleaned;
    }

    // If number doesn't match expected patterns, return null
    return cleaned.length >= 10 ? '62' + cleaned : null;
}

/**
 * Create WhatsApp message URL
 * 
 * @param phone - Phone number
 * @param message - Message text
 * @returns WhatsApp URL or null if phone is invalid
 */
export function createWhatsAppUrl(phone: string | null | undefined, message: string): string | null {
    const formattedPhone = formatPhoneForWhatsApp(phone);
    if (!formattedPhone) return null;

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
