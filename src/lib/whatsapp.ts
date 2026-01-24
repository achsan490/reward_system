import { formatPhoneForWhatsApp, createWhatsAppUrl } from './phoneUtils';

/**
 * Send WhatsApp notification to winner
 * Opens WhatsApp with pre-filled message
 */
export function sendWinnerWhatsAppNotification({
    phone,
    memberName,
    rank,
    campaignName,
    pointsAtWin,
    criteria,
}: {
    phone: string | null | undefined;
    memberName: string;
    rank: number;
    campaignName: string;
    pointsAtWin: number;
    criteria: string;
}): { success: boolean; url?: string; error?: string } {
    if (!phone) {
        return {
            success: false,
            error: 'No phone number provided',
        };
    }

    const formattedPhone = formatPhoneForWhatsApp(phone);

    if (!formattedPhone) {
        return {
            success: false,
            error: 'Invalid phone number format',
        };
    }

    const criteriaLabel = {
        top_points: 'Total Poin',
        top_spending: 'Total Belanja',
        top_transactions: 'Jumlah Transaksi',
    }[criteria] || criteria;

    const message = `🎉 *Selamat, ${memberName}!*

Anda terpilih sebagai *Pemenang Campaign* kami!

📋 *Detail Campaign:*
Campaign: ${campaignName}
Peringkat: #${rank} 🏆
Kriteria: ${criteriaLabel}
Total Poin: ${pointsAtWin.toLocaleString('id-ID')} poin

Terima kasih atas kesetiaan dan partisipasi Anda dalam program loyalty kami! 🙏

Silakan kunjungi toko kami untuk mengklaim reward Anda.

_Catatan: Pastikan membawa ID member Anda saat mengklaim reward._

---
Reward System © 2025`;

    const url = createWhatsAppUrl(phone, message);

    if (!url) {
        return {
            success: false,
            error: 'Failed to create WhatsApp URL',
        };
    }

    return {
        success: true,
        url,
    };
}

/**
 * Generate WhatsApp URLs for all winners
 * Returns array of URLs that can be opened in browser
 */
export function generateWinnersWhatsAppUrls(winners: Array<{
    phone: string | null | undefined;
    memberName: string;
    rank: number;
    campaignName: string;
    pointsAtWin: number;
    criteria: string;
}>): Array<{
    memberName: string;
    phone: string | null | undefined;
    url: string | null;
    success: boolean;
    error?: string;
}> {
    return winners.map((winner) => {
        const result = sendWinnerWhatsAppNotification(winner);

        return {
            memberName: winner.memberName,
            phone: winner.phone,
            url: result.url || null,
            success: result.success,
            error: result.error,
        };
    });
}
