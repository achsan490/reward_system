import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export async function getActiveCampaignStats() {
    noStore();
    try {
        const now = new Date();

        // 1. Get Active Campaign and Last Completed Campaign in parallel
        const [activeCampaign, lastCampaign] = await Promise.all([
            prisma.rewardCampaign.findFirst({
                where: {
                    status: "active",
                    startDate: { lte: now },
                    endDate: { gte: now },
                },
                include: {
                    _count: {
                        select: { rewards: true }
                    }
                },
                orderBy: { endDate: 'asc' } // The one ending soonest
            }),
            prisma.rewardCampaign.findFirst({
                where: {
                    status: { in: ['completed', 'active'] }, // Include active if date passed but status not updated
                    endDate: { lt: now }
                },
                orderBy: { endDate: 'desc' },
                include: {
                    rewards: {
                        take: 3,
                        orderBy: { rank: 'asc' },
                        include: {
                            member: { select: { name: true, email: true } }
                        }
                    }
                }
            })
        ]);

        // If active campaign exists, calculate current leader (prediction)
        let currentLeader = null;
        if (activeCampaign) {
            // Re-use logic for finding top member temporarily
            // Ideally this should be a shared heavy query, but for dashboard card we keep it light or cached
            // For now, we fetch just ONE top candidate
            const transactionAggregates = await prisma.transaction.groupBy({
                by: ["memberId"],
                where: {
                    transactionDate: {
                        gte: activeCampaign.startDate,
                        lte: activeCampaign.endDate,
                    },
                },
                _sum: {
                    pointsEarned: true,
                    amount: true,
                },
                _count: {
                    id: true,
                },
            });

            // Simple in-memory sort for just the leader
            if (transactionAggregates.length > 0) {
                let topAgg = transactionAggregates[0];

                // Helper to calculate score based on criteria
                const getScore = (agg: any) => {
                    if (activeCampaign.criteria === 'top_spending') return agg._sum.amount || 0;
                    if (activeCampaign.criteria === 'top_transactions') return agg._count.id || 0;
                    return agg._sum.pointsEarned || 0;
                };

                // Find max
                transactionAggregates.forEach(agg => {
                    if (getScore(agg) > getScore(topAgg)) {
                        topAgg = agg;
                    }
                });

                // Get name
                const member = await prisma.member.findUnique({
                    where: { id: topAgg.memberId },
                    select: { name: true }
                });

                if (member) {
                    currentLeader = {
                        name: member.name,
                        score: getScore(topAgg),
                        metric: activeCampaign.criteria === 'top_spending' ? 'Rp' :
                            activeCampaign.criteria === 'top_transactions' ? 'Trx' : 'Poin'
                    };
                }
            }
        }

        return {
            success: true,
            data: {
                activeCampaign: activeCampaign ? {
                    name: activeCampaign.name,
                    endDate: activeCampaign.endDate,
                    leader: currentLeader
                } : null,
                lastWinners: lastCampaign ? lastCampaign.rewards.map(r => ({
                    rank: r.rank,
                    name: r.member.name,
                    points: r.pointsAtWin,
                    campaignName: lastCampaign.name
                })) : []
            }
        };
    } catch (error) {
        console.error("Error getting dashboard campaign stats:", error);
        return { success: false, error: "Failed" };
    }
}
