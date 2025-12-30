"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Get all reward campaigns with optional filtering
 */
export async function getRewardCampaigns(params?: {
    status?: "active" | "completed" | "cancelled" | "all";
}) {
    try {
        const status = params?.status || "all";

        const campaigns = await prisma.rewardCampaign.findMany({
            where:
                status !== "all"
                    ? {
                        status: status,
                    }
                    : undefined,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                _count: {
                    select: {
                        rewards: true,
                    },
                },
            },
        });

        return { success: true, data: campaigns };
    } catch (error) {
        console.error("Error getting reward campaigns:", error);
        return { success: false, error: "Failed to fetch reward campaigns" };
    }
}

/**
 * Get reward campaign by ID with winners
 */
export async function getRewardCampaignById(campaignId: string) {
    try {
        const campaign = await prisma.rewardCampaign.findUnique({
            where: { id: campaignId },
            include: {
                rewards: {
                    include: {
                        member: {
                            select: {
                                id: true,
                                memberId: true,
                                name: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                    orderBy: {
                        rank: "asc",
                    },
                },
            },
        });

        if (!campaign) {
            return { success: false, error: "Campaign not found" };
        }

        return { success: true, data: campaign };
    } catch (error) {
        console.error("Error getting campaign:", error);
        return { success: false, error: "Failed to fetch campaign details" };
    }
}

/**
 * Create new reward campaign and calculate winners
 */
export async function createRewardCampaign(data: {
    name: string;
    description?: string;
    criteria: "top_points" | "top_spending" | "top_transactions";
    winnersCount: number;
    startDate: Date;
    endDate: Date;
}) {
    try {
        // Create campaign
        const campaign = await prisma.rewardCampaign.create({
            data: {
                name: data.name,
                description: data.description,
                criteria: data.criteria,
                winnersCount: data.winnersCount,
                startDate: data.startDate,
                endDate: data.endDate,
                status: "active",
            },
        });

        // Calculate and create winners
        await calculateWinners(campaign.id);

        revalidatePath("/reward-determination");
        return {
            success: true,
            data: campaign,
            message: "Campaign created successfully",
        };
    } catch (error) {
        console.error("Error creating campaign:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Calculate winners for a campaign based on criteria
 */
export async function calculateWinners(campaignId: string) {
    try {
        const campaign = await prisma.rewardCampaign.findUnique({
            where: { id: campaignId },
        });

        if (!campaign) {
            return { success: false, error: "Campaign not found" };
        }

        // Delete existing winners for this campaign
        await prisma.rewardWinner.deleteMany({
            where: { campaignId: campaignId },
        });

        // Get members based on criteria within date range
        let orderByField: "totalPoints" | "totalSpent" | "transactionCount" =
            "totalPoints";

        if (campaign.criteria === "top_spending") {
            orderByField = "totalSpent";
        } else if (campaign.criteria === "top_transactions") {
            orderByField = "transactionCount";
        }

        // Get top members
        const topMembers = await prisma.member.findMany({
            where: {
                transactions: {
                    some: {
                        transactionDate: {
                            gte: campaign.startDate,
                            lte: campaign.endDate,
                        },
                    },
                },
            },
            orderBy: {
                [orderByField]: "desc",
            },
            take: campaign.winnersCount,
            select: {
                id: true,
                totalPoints: true,
                totalSpent: true,
                transactionCount: true,
            },
        });

        // Create winner records
        const winners = await Promise.all(
            topMembers.map((member, index) =>
                prisma.rewardWinner.create({
                    data: {
                        campaignId: campaignId,
                        memberId: member.id,
                        rank: index + 1,
                        pointsAtWin: member.totalPoints,
                        spentAtWin: member.totalSpent,
                        transactionsAtWin: member.transactionCount,
                    },
                })
            )
        );

        revalidatePath("/reward-determination");
        return {
            success: true,
            data: winners,
            message: `Successfully calculated ${winners.length} winners`,
        };
    } catch (error) {
        console.error("Error calculating winners:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Mark reward as claimed
 */
export async function markRewardClaimed(
    winnerId: string,
    claimed: boolean,
    notes?: string
) {
    try {
        const winner = await prisma.rewardWinner.update({
            where: { id: winnerId },
            data: {
                rewardClaimed: claimed,
                claimedAt: claimed ? new Date() : null,
                notes: notes,
            },
        });

        revalidatePath("/reward-determination");
        return {
            success: true,
            data: winner,
            message: `Reward ${claimed ? "claimed" : "unclaimed"} successfully`,
        };
    } catch (error) {
        console.error("Error marking reward:", error);
        return { success: false, error: "Failed to update reward status" };
    }
}

/**
 * Get reward statistics
 */
export async function getRewardStatistics() {
    try {
        const [totalCampaigns, activeCampaigns, totalWinners, claimedRewards] =
            await Promise.all([
                prisma.rewardCampaign.count(),
                prisma.rewardCampaign.count({
                    where: { status: "active" },
                }),
                prisma.rewardWinner.count(),
                prisma.rewardWinner.count({
                    where: { rewardClaimed: true },
                }),
            ]);

        return {
            success: true,
            data: {
                totalCampaigns,
                activeCampaigns,
                totalWinners,
                claimedRewards,
            },
        };
    } catch (error) {
        console.error("Error getting statistics:", error);
        return { success: false, error: "Failed to fetch statistics" };
    }
}

/**
 * Update campaign status
 */
export async function updateCampaignStatus(
    campaignId: string,
    status: "active" | "completed" | "cancelled"
) {
    try {
        const campaign = await prisma.rewardCampaign.update({
            where: { id: campaignId },
            data: { status },
        });

        revalidatePath("/reward-determination");
        return {
            success: true,
            data: campaign,
            message: "Campaign status updated successfully",
        };
    } catch (error) {
        console.error("Error updating campaign status:", error);
        return { success: false, error: "Failed to update campaign status" };
    }
}

/**
 * Delete reward campaign
 */
export async function deleteRewardCampaign(campaignId: string) {
    try {
        await prisma.rewardCampaign.delete({
            where: { id: campaignId },
        });

        revalidatePath("/reward-determination");
        return { success: true, message: "Campaign deleted successfully" };
    } catch (error) {
        console.error("Error deleting campaign:", error);
        return { success: false, error: "Failed to delete campaign" };
    }
}

/**
 * Export reward winners to CSV
 */
export async function exportRewardWinners(campaignId: string) {
    try {
        const campaign = await prisma.rewardCampaign.findUnique({
            where: { id: campaignId },
            include: {
                rewards: {
                    include: {
                        member: true,
                    },
                    orderBy: {
                        rank: "asc",
                    },
                },
            },
        });

        if (!campaign) {
            return { success: false, error: "Campaign not found" };
        }

        // Create CSV header
        const header = [
            "Rank",
            "Member ID",
            "Nama",
            "Email",
            "Telepon",
            "Points",
            "Total Belanja",
            "Jumlah Transaksi",
            "Status Klaim",
            "Tanggal Klaim",
        ].join(",");

        // Create CSV rows
        const rows = campaign.rewards.map((winner) => {
            return [
                winner.rank,
                winner.member.memberId,
                `"${winner.member.name}"`,
                winner.member.email || "",
                winner.member.phone || "",
                winner.pointsAtWin,
                winner.spentAtWin,
                winner.transactionsAtWin,
                winner.rewardClaimed ? "Sudah Diklaim" : "Belum Diklaim",
                winner.claimedAt
                    ? new Date(winner.claimedAt).toLocaleDateString("id-ID")
                    : "",
            ].join(",");
        });

        // Combine header and rows
        const csv = [header, ...rows].join("\n");

        return { success: true, data: csv };
    } catch (error) {
        console.error("Error exporting winners:", error);
        return { success: false, error: "Failed to export winners data" };
    }
}

/**
 * Get campaign insights and analytics
 */
export async function getCampaignInsights() {
    try {
        // Get all campaigns with their rewards
        const campaigns = await prisma.rewardCampaign.findMany({
            include: {
                rewards: {
                    select: {
                        memberId: true,
                        rewardClaimed: true,
                    },
                },
            },
        });

        if (campaigns.length === 0) {
            return {
                success: true,
                data: {
                    topCriteria: null,
                    totalMembersParticipated: 0,
                    averageWinnersPerCampaign: 0,
                    claimRate: 0,
                },
            };
        }

        // Calculate criteria usage
        const criteriaCount: Record<string, number> = {};
        campaigns.forEach((campaign) => {
            criteriaCount[campaign.criteria] =
                (criteriaCount[campaign.criteria] || 0) + 1;
        });

        const topCriteria = Object.entries(criteriaCount).reduce((a, b) =>
            a[1] > b[1] ? a : b
        );

        // Get unique members who participated
        const uniqueMembers = new Set<string>();
        campaigns.forEach((campaign) => {
            campaign.rewards.forEach((reward) => {
                uniqueMembers.add(reward.memberId);
            });
        });

        // Calculate average winners per campaign
        const totalWinners = campaigns.reduce(
            (sum, campaign) => sum + campaign.rewards.length,
            0
        );
        const averageWinnersPerCampaign =
            campaigns.length > 0 ? totalWinners / campaigns.length : 0;

        // Calculate claim rate
        const claimedRewards = campaigns.reduce(
            (sum, campaign) =>
                sum +
                campaign.rewards.filter((r) => r.rewardClaimed).length,
            0
        );
        const claimRate =
            totalWinners > 0 ? (claimedRewards / totalWinners) * 100 : 0;

        return {
            success: true,
            data: {
                topCriteria: {
                    criteria: topCriteria[0],
                    count: topCriteria[1],
                },
                totalMembersParticipated: uniqueMembers.size,
                averageWinnersPerCampaign,
                claimRate,
            },
        };
    } catch (error) {
        console.error("Error getting campaign insights:", error);
        return {
            success: false,
            error: "Failed to fetch campaign insights",
        };
    }
}
