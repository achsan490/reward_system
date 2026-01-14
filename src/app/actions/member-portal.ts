"use server";

import { prisma } from "@/lib/prisma";
import { getMemberExpiringPoints } from "./point-expiration";
import QRCode from "qrcode";

/**
 * Get member info by member ID (Public - no auth required)
 * This is safe for public access as it only returns non-sensitive data
 */
export async function getMemberByMemberId(memberId: string) {
    try {
        if (!memberId || memberId.trim() === "") {
            return {
                success: false,
                error: "Member ID is required",
            };
        }

        const member = await prisma.member.findFirst({
            where: {
                OR: [
                    { memberId: memberId.trim() },
                    { memberId: memberId.trim().toUpperCase() }
                ]
            },
            select: {
                id: true,
                memberId: true,
                name: true,
                totalPoints: true,
                totalSpent: true,
                transactionCount: true,
                createdAt: true,
                transactions: {
                    orderBy: { transactionDate: "desc" },
                    take: 10,
                    select: {
                        id: true,
                        transactionDate: true,
                        amount: true,
                        pointsEarned: true,
                        pointsExpiryDate: true,
                        pointsExpired: true,
                    },
                },
            },
        });

        if (!member) {
            return {
                success: false,
                error: "Member not found",
            };
        }

        // Get expiring points info
        const expiringPointsResult = await getMemberExpiringPoints(member.id);
        const expiringPoints = expiringPointsResult.success
            ? expiringPointsResult.data
            : null;

        return {
            success: true,
            data: {
                ...member,
                expiringPoints,
            },
        };
    } catch (error) {
        console.error("Error getting member by ID:", error);
        return {
            success: false,
            error: `Error: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
}

/**
 * Get member info by phone number (Public - no auth required)
 * This is safe for public access as it only returns non-sensitive data
 */
export async function getMemberByPhone(phone: string) {
    try {
        if (!phone || phone.trim() === "") {
            return {
                success: false,
                error: "Nomor WhatsApp diperlukan",
            };
        }

        // Normalize phone number (remove spaces, dashes, etc.)
        const normalizedPhone = phone.trim().replace(/[\s\-\(\)]/g, "");

        const member = await prisma.member.findFirst({
            where: { phone: normalizedPhone },
            select: {
                id: true,
                memberId: true,
                name: true,
                totalPoints: true,
                totalSpent: true,
                transactionCount: true,
                createdAt: true,
                transactions: {
                    orderBy: { transactionDate: "desc" },
                    take: 10,
                    select: {
                        id: true,
                        transactionDate: true,
                        amount: true,
                        pointsEarned: true,
                        pointsExpiryDate: true,
                        pointsExpired: true,
                    },
                },
            },
        });

        if (!member) {
            return {
                success: false,
                error: "Member dengan nomor WhatsApp tersebut tidak ditemukan",
            };
        }

        // Get expiring points info
        const expiringPointsResult = await getMemberExpiringPoints(member.id);
        const expiringPoints = expiringPointsResult.success
            ? expiringPointsResult.data
            : null;

        return {
            success: true,
            data: {
                ...member,
                expiringPoints,
            },
        };
    } catch (error) {
        console.error("Error getting member by phone:", error);
        return {
            success: false,
            error: "Gagal mengambil informasi member",
        };
    }
}

/**
 * Generate QR code for member
 */
export async function generateMemberQRCode(
    memberId: string,
    options?: {
        size?: number;
        margin?: number;
    }
) {
    try {
        // Verify member exists
        const member = await prisma.member.findUnique({
            where: { memberId: memberId.trim() },
            select: { id: true, memberId: true },
        });

        if (!member) {
            return {
                success: false,
                error: "Member not found",
            };
        }

        // Generate QR code URL (points to public member check page)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;
        const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
        const baseUrl = appUrl || vercelUrl;

        if (!baseUrl) {
            return {
                success: false,
                error: "Application URL not configured. Please set NEXT_PUBLIC_APP_URL environment variable in Vercel.",
            };
        }

        const qrData = `${baseUrl}/member/check?id=${member.memberId}`;

        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
            width: options?.size || 300,
            margin: options?.margin || 2,
            color: {
                dark: "#000000",
                light: "#FFFFFF",
            },
        });

        return {
            success: true,
            data: {
                qrCodeDataUrl,
                memberId: member.memberId,
                url: qrData,
            },
        };
    } catch (error) {
        console.error("Error generating QR code:", error);
        return {
            success: false,
            error: "Failed to generate QR code",
        };
    }
}

/**
 * Bulk generate QR codes for multiple members
 */
export async function bulkGenerateQRCodes(memberIds: string[]) {
    try {
        const results = [];

        for (const memberId of memberIds) {
            const result = await generateMemberQRCode(memberId);
            if (result.success) {
                results.push(result.data);
            }
        }

        return {
            success: true,
            data: results,
        };
    } catch (error) {
        console.error("Error bulk generating QR codes:", error);
        return {
            success: false,
            error: "Failed to generate QR codes",
        };
    }
}

/**
 * Get member card data
 */
export async function getMemberCardData(memberId: string) {
    try {
        const member = await prisma.member.findFirst({
            where: {
                OR: [
                    { memberId: memberId.trim() },
                    { memberId: memberId.trim().toUpperCase() }
                ]
            },
            select: {
                id: true,
                memberId: true,
                name: true,
                totalPoints: true,
                createdAt: true,
            },
        });

        if (!member) {
            return {
                success: false,
                error: "Member not found",
            };
        }

        // Generate QR code
        const qrResult = await generateMemberQRCode(memberId, { size: 200 });

        if (!qrResult.success) {
            return {
                success: false,
                error: "Failed to generate QR code for card",
            };
        }

        return {
            success: true,
            data: {
                member,
                qrCode: qrResult.data?.qrCodeDataUrl,
            },
        };
    } catch (error) {
        console.error("Error getting member card data:", error);
        return {
            success: false,
            error: "Failed to get member card data",
        };
    }
}

/**
 * Get all members for QR/card generation
 */
export async function getAllMembersForGeneration() {
    try {
        const members = await prisma.member.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                memberId: true,
                name: true,
                totalPoints: true,
            },
        });

        return {
            success: true,
            data: members,
        };
    } catch (error) {
        console.error("Error getting members:", error);
        return {
            success: false,
            error: "Failed to fetch members",
        };
    }
}
