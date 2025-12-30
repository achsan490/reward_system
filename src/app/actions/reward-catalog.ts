"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Get all reward catalog items
 */
export async function getAllRewardCatalogs(includeInactive = false) {
    try {
        const catalogs = await prisma.rewardCatalog.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { redemptions: true },
                },
            },
        });

        return {
            success: true,
            data: catalogs,
        };
    } catch (error) {
        console.error("Error fetching reward catalogs:", error);
        return {
            success: false,
            error: "Failed to fetch reward catalogs",
        };
    }
}

/**
 * Get active reward catalogs (for member view)
 */
export async function getActiveRewardCatalogs() {
    try {
        const now = new Date();

        const catalogs = await prisma.rewardCatalog.findMany({
            where: {
                isActive: true,
                OR: [
                    { validUntil: null },
                    { validUntil: { gte: now } },
                ],
            },
            orderBy: { pointsRequired: "asc" },
        });

        return {
            success: true,
            data: catalogs,
        };
    } catch (error) {
        console.error("Error fetching active catalogs:", error);
        return {
            success: false,
            error: "Failed to fetch active catalogs",
        };
    }
}

/**
 * Get reward catalog by ID
 */
export async function getRewardCatalogById(id: string) {
    try {
        const catalog = await prisma.rewardCatalog.findUnique({
            where: { id },
            include: {
                redemptions: {
                    include: {
                        member: {
                            select: {
                                memberId: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: { redeemedAt: "desc" },
                    take: 10,
                },
            },
        });

        if (!catalog) {
            return {
                success: false,
                error: "Catalog not found",
            };
        }

        return {
            success: true,
            data: catalog,
        };
    } catch (error) {
        console.error("Error fetching catalog:", error);
        return {
            success: false,
            error: "Failed to fetch catalog",
        };
    }
}

/**
 * Create reward catalog
 */
export async function createRewardCatalog(data: {
    name: string;
    description?: string;
    pointsRequired: number;
    stock?: number;
    imageUrl?: string;
    category?: string;
    validUntil?: Date;
}) {
    try {
        const catalog = await prisma.rewardCatalog.create({
            data: {
                name: data.name,
                description: data.description,
                pointsRequired: data.pointsRequired,
                stock: data.stock,
                imageUrl: data.imageUrl,
                category: data.category,
                validUntil: data.validUntil,
            },
        });

        revalidatePath("/reward-catalog");
        revalidatePath("/member/rewards");

        return {
            success: true,
            data: catalog,
        };
    } catch (error) {
        console.error("Error creating catalog:", error);
        return {
            success: false,
            error: "Failed to create catalog",
        };
    }
}

/**
 * Update reward catalog
 */
export async function updateRewardCatalog(
    id: string,
    data: {
        name?: string;
        description?: string;
        pointsRequired?: number;
        stock?: number;
        imageUrl?: string;
        category?: string;
        isActive?: boolean;
        validUntil?: Date | null;
    }
) {
    try {
        const catalog = await prisma.rewardCatalog.update({
            where: { id },
            data,
        });

        revalidatePath("/reward-catalog");
        revalidatePath("/member/rewards");

        return {
            success: true,
            data: catalog,
        };
    } catch (error) {
        console.error("Error updating catalog:", error);
        return {
            success: false,
            error: "Failed to update catalog",
        };
    }
}

/**
 * Delete reward catalog
 */
export async function deleteRewardCatalog(id: string) {
    try {
        // Check if there are any redemptions
        const redemptionCount = await prisma.rewardRedemption.count({
            where: { catalogId: id },
        });

        if (redemptionCount > 0) {
            return {
                success: false,
                error: "Cannot delete catalog with existing redemptions. Deactivate it instead.",
            };
        }

        await prisma.rewardCatalog.delete({
            where: { id },
        });

        revalidatePath("/reward-catalog");

        return {
            success: true,
        };
    } catch (error) {
        console.error("Error deleting catalog:", error);
        return {
            success: false,
            error: "Failed to delete catalog",
        };
    }
}

/**
 * Get catalog statistics
 */
export async function getRewardCatalogStats() {
    try {
        const [totalCatalogs, activeCatalogs, totalRedemptions, pendingRedemptions] = await Promise.all([
            prisma.rewardCatalog.count(),
            prisma.rewardCatalog.count({ where: { isActive: true } }),
            prisma.rewardRedemption.count(),
            prisma.rewardRedemption.count({ where: { status: "pending" } }),
        ]);

        return {
            success: true,
            data: {
                totalCatalogs,
                activeCatalogs,
                totalRedemptions,
                pendingRedemptions,
            },
        };
    } catch (error) {
        console.error("Error fetching stats:", error);
        return {
            success: false,
            error: "Failed to fetch statistics",
        };
    }
}
