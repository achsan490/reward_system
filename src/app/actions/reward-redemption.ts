"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Deduct points from member using FIFO (First In First Out) method
 * This ensures points that will expire soon are used first
 */
async function deductPointsFIFO(memberId: string, pointsToDeduct: number) {
    // Get transactions with available points, oldest expiry first
    const transactions = await prisma.transaction.findMany({
        where: {
            memberId,
            pointsExpired: false,
            pointsEarned: { gt: 0 },
        },
        orderBy: [
            { pointsExpiryDate: "asc" }, // Expiring soon first
            { transactionDate: "asc" },  // Then oldest first
        ],
    });

    let remaining = pointsToDeduct;
    const updates = [];

    for (const txn of transactions) {
        if (remaining <= 0) break;

        const deduct = Math.min(txn.pointsEarned, remaining);

        updates.push(
            prisma.transaction.update({
                where: { id: txn.id },
                data: {
                    pointsEarned: txn.pointsEarned - deduct,
                },
            })
        );

        remaining -= deduct;
    }

    // Execute all updates
    await Promise.all(updates);

    // Update member total points
    await prisma.member.update({
        where: { id: memberId },
        data: {
            totalPoints: { decrement: pointsToDeduct },
        },
    });
}

/**
 * Refund points to member (reverse of deduction)
 */
async function refundPoints(memberId: string, pointsToRefund: number) {
    await prisma.member.update({
        where: { id: memberId },
        data: {
            totalPoints: { increment: pointsToRefund },
        },
    });
}

/**
 * Redeem a reward
 */
export async function redeemReward(
    memberId: string,
    catalogId: string,
    notes?: string
) {
    try {
        // Use transaction to prevent race conditions
        const result = await prisma.$transaction(async (tx) => {
            // 1. Get catalog
            const catalog = await tx.rewardCatalog.findUnique({
                where: { id: catalogId },
            });

            if (!catalog) {
                throw new Error("Reward not found");
            }

            if (!catalog.isActive) {
                throw new Error("Reward is not active");
            }

            // Check if expired
            if (catalog.validUntil && catalog.validUntil < new Date()) {
                throw new Error("Reward has expired");
            }

            // Check stock
            if (catalog.stock !== null && catalog.stock <= 0) {
                throw new Error("Reward is out of stock");
            }

            // 2. Get member
            const member = await tx.member.findUnique({
                where: { id: memberId },
            });

            if (!member) {
                throw new Error("Member not found");
            }

            // 3. Check if member has enough points
            if (member.totalPoints < catalog.pointsRequired) {
                throw new Error(
                    `Insufficient points. You have ${member.totalPoints} points but need ${catalog.pointsRequired} points.`
                );
            }

            // 4. Determine status based on category (Auto-approve Vouchers & Discounts)
            // Robust check: trim whitespace and lowercase
            const isAutoApprove = ["voucher", "discount"].includes(catalog.category?.trim().toLowerCase() || "");

            // 5. Create redemption record
            const redemption = await tx.rewardRedemption.create({
                data: {
                    memberId,
                    catalogId,
                    pointsUsed: catalog.pointsRequired,
                    status: isAutoApprove ? "approved" : "pending",
                    notes,
                    processedAt: isAutoApprove ? new Date() : undefined,
                    processedBy: isAutoApprove ? "SYSTEM" : undefined,
                },
            });

            // 6. If auto-approved, decrement stock immediately
            if (isAutoApprove && catalog.stock !== null) {
                await tx.rewardCatalog.update({
                    where: { id: catalogId },
                    data: {
                        stock: { decrement: 1 },
                    },
                });
            }

            return { redemption, catalog, member };
        });

        // 5. Deduct points using FIFO (outside transaction for better performance)
        await deductPointsFIFO(memberId, result.catalog.pointsRequired);

        revalidatePath("/member/rewards");
        revalidatePath("/member/my-redemptions");
        revalidatePath("/redemption-requests");

        return {
            success: true,
            data: result.redemption,
        };
    } catch (error: any) {
        console.error("Error redeeming reward:", error);
        return {
            success: false,
            error: error.message || "Failed to redeem reward",
        };
    }
}

/**
 * Get all redemptions (for admin)
 */
export async function getAllRedemptions(filters?: {
    status?: string;
    memberId?: string;
    catalogId?: string;
}) {
    try {
        const redemptions = await prisma.rewardRedemption.findMany({
            where: {
                ...(filters?.status && { status: filters.status }),
                ...(filters?.memberId && { memberId: filters.memberId }),
                ...(filters?.catalogId && { catalogId: filters.catalogId }),
            },
            include: {
                member: {
                    select: {
                        memberId: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
                catalog: {
                    select: {
                        name: true,
                        pointsRequired: true,
                        category: true,
                    },
                },
            },
            orderBy: { redeemedAt: "desc" },
        });

        return {
            success: true,
            data: redemptions,
        };
    } catch (error) {
        console.error("Error fetching redemptions:", error);
        return {
            success: false,
            error: "Failed to fetch redemptions",
        };
    }
}

/**
 * Get member redemptions
 */
export async function getMemberRedemptions(memberId: string) {
    try {
        const redemptions = await prisma.rewardRedemption.findMany({
            where: { memberId },
            include: {
                catalog: {
                    select: {
                        name: true,
                        description: true,
                        pointsRequired: true,
                        category: true,
                        imageUrl: true,
                    },
                },
            },
            orderBy: { redeemedAt: "desc" },
        });

        return {
            success: true,
            data: redemptions,
        };
    } catch (error) {
        console.error("Error fetching member redemptions:", error);
        return {
            success: false,
            error: "Failed to fetch redemptions",
        };
    }
}

/**
 * Approve redemption
 */
export async function approveRedemption(
    redemptionId: string,
    adminId: string,
    adminNotes?: string
) {
    try {
        const redemption = await prisma.$transaction(async (tx) => {
            // Get redemption
            const redemption = await tx.rewardRedemption.findUnique({
                where: { id: redemptionId },
                include: { catalog: true },
            });

            if (!redemption) {
                throw new Error("Redemption not found");
            }

            if (redemption.status !== "pending") {
                throw new Error("Redemption is not pending");
            }

            // Update redemption status
            const updated = await tx.rewardRedemption.update({
                where: { id: redemptionId },
                data: {
                    status: "approved",
                    processedAt: new Date(),
                    processedBy: adminId,
                    adminNotes,
                },
            });

            // Decrease stock if limited
            if (redemption.catalog.stock !== null) {
                await tx.rewardCatalog.update({
                    where: { id: redemption.catalogId },
                    data: {
                        stock: { decrement: 1 },
                    },
                });
            }

            return updated;
        });

        revalidatePath("/redemption-requests");
        revalidatePath("/member/my-redemptions");

        return {
            success: true,
            data: redemption,
        };
    } catch (error: any) {
        console.error("Error approving redemption:", error);
        return {
            success: false,
            error: error.message || "Failed to approve redemption",
        };
    }
}

/**
 * Reject redemption and refund points
 */
export async function rejectRedemption(
    redemptionId: string,
    adminId: string,
    adminNotes: string
) {
    try {
        const redemption = await prisma.$transaction(async (tx) => {
            // Get redemption
            const redemption = await tx.rewardRedemption.findUnique({
                where: { id: redemptionId },
            });

            if (!redemption) {
                throw new Error("Redemption not found");
            }

            if (redemption.status !== "pending") {
                throw new Error("Redemption is not pending");
            }

            // Update redemption status
            const updated = await tx.rewardRedemption.update({
                where: { id: redemptionId },
                data: {
                    status: "rejected",
                    processedAt: new Date(),
                    processedBy: adminId,
                    adminNotes,
                },
            });

            return updated;
        });

        // Refund points
        await refundPoints(redemption.memberId, redemption.pointsUsed);

        revalidatePath("/redemption-requests");
        revalidatePath("/member/my-redemptions");

        return {
            success: true,
            data: redemption,
        };
    } catch (error: any) {
        console.error("Error rejecting redemption:", error);
        return {
            success: false,
            error: error.message || "Failed to reject redemption",
        };
    }
}

/**
 * Mark redemption as completed
 */
export async function completeRedemption(redemptionId: string) {
    try {
        const redemption = await prisma.rewardRedemption.update({
            where: { id: redemptionId },
            data: {
                status: "completed",
                completedAt: new Date(),
            },
        });

        revalidatePath("/redemption-requests");

        return {
            success: true,
            data: redemption,
        };
    } catch (error) {
        console.error("Error completing redemption:", error);
        return {
            success: false,
            error: "Failed to complete redemption",
        };
    }
}

/**
 * Get redemption statistics
 */
export async function getRedemptionStats() {
    try {
        const [
            totalRedemptions,
            pendingRedemptions,
            approvedRedemptions,
            completedRedemptions,
            rejectedRedemptions,
            expiredRedemptions,
            totalPointsRedeemed,
        ] = await Promise.all([
            prisma.rewardRedemption.count(),
            prisma.rewardRedemption.count({ where: { status: "pending" } }),
            prisma.rewardRedemption.count({ where: { status: "approved" } }),
            prisma.rewardRedemption.count({ where: { status: "completed" } }),
            prisma.rewardRedemption.count({ where: { status: "rejected" } }),
            prisma.rewardRedemption.count({ where: { status: "expired" } }),
            prisma.rewardRedemption.aggregate({
                _sum: { pointsUsed: true },
                where: { status: { in: ["approved", "completed"] } },
            }),
        ]);

        return {
            success: true,
            data: {
                totalRedemptions,
                pendingRedemptions,
                approvedRedemptions,
                completedRedemptions,
                rejectedRedemptions,
                expiredRedemptions: expiredRedemptions || 0,
                totalPointsRedeemed: totalPointsRedeemed._sum.pointsUsed || 0,
            },
        };
    } catch (error) {
        console.error("Error fetching redemption stats:", error);
        return {
            success: false,
            error: "Failed to fetch statistics",
        };
    }
}

/**
 * Delete redemption record
 */
export async function deleteRedemption(redemptionId: string) {
    try {
        await prisma.rewardRedemption.delete({
            where: { id: redemptionId },
        });

        revalidatePath("/redemption-requests");
        revalidatePath("/member/my-redemptions");

        return {
            success: true,
            message: "Redemption record deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting redemption:", error);
        return {
            success: false,
            error: "Failed to delete redemption record",
        };
    }
}

/**
 * Delete all completed redemption records
 */
export async function deleteAllCompletedRedemptions() {
    try {
        const result = await prisma.rewardRedemption.deleteMany({
            where: { status: "completed" },
        });

        revalidatePath("/redemption-requests");
        revalidatePath("/member/my-redemptions");

        return {
            success: true,
            message: `Successfully deleted ${result.count} completed redemption records`,
        };
    } catch (error) {
        console.error("Error deleting completed redemptions:", error);
        return {
            success: false,
            error: "Failed to delete completed redemption records",
        };
    }
}

/**
 * Automatically expire approved redemptions older than 30 days
 * This should be called when loading redemption pages
 */
export async function autoExpireRedemptions() {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Find applicable redemptions
        const expiredRedemptions = await prisma.rewardRedemption.updateMany({
            where: {
                status: "approved", // Only approved items can expire (pending relies on admin action)
                processedAt: {
                    lt: thirtyDaysAgo, // Older than 30 days
                },
            },
            data: {
                status: "expired",
            },
        });

        if (expiredRedemptions.count > 0) {
            revalidatePath("/redemption-requests");
            revalidatePath("/member/my-redemptions");
        }

        return {
            success: true,
            count: expiredRedemptions.count,
        };
    } catch (error) {
        console.error("Error auto-expiring redemptions:", error);
        return {
            success: false,
            error: "Failed to auto-expire redemptions",
        };
    }
}
