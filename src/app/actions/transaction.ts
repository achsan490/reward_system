"use server";

import { prisma } from "@/lib/prisma";
import { calculatePoints, parseCSV } from "@/lib/pointCalculator";
import { revalidatePath } from "next/cache";

/**
 * Get point conversion rate from system settings
 */
async function getPointConversionRate(): Promise<number> {
    const setting = await prisma.systemSetting.findUnique({
        where: { key: "point_conversion_rate" },
    });

    if (!setting) {
        // Create default setting if not exists
        await prisma.systemSetting.create({
            data: {
                key: "point_conversion_rate",
                value: "5000",
                label: "Point Conversion Rate",
                type: "number",
            },
        });
        return 5000;
    }

    return parseFloat(setting.value);
}

/**
 * Upload and process transaction CSV file
 */
export async function uploadTransactions(formData: FormData) {
    try {
        const file = formData.get("file") as File;

        if (!file) {
            return { success: false, error: "No file uploaded" };
        }

        // Read file content
        const content = await file.text();
        const transactions = parseCSV(content);

        if (transactions.length === 0) {
            return { success: false, error: "No valid transactions found in file" };
        }

        // Get conversion rate
        const conversionRate = await getPointConversionRate();

        // Get expiration settings
        const expirationSettings = await prisma.systemSetting.findUnique({
            where: { key: "point_expiration_enabled" },
        });
        const expirationDaysSetting = await prisma.systemSetting.findUnique({
            where: { key: "point_expiration_days" },
        });

        const expirationEnabled = expirationSettings?.value === "true";
        const expirationDays = expirationDaysSetting
            ? parseInt(expirationDaysSetting.value)
            : 90;

        // --- OPTIMIZATION START ---
        // 1. Resolve Members (Bulk)
        const distinctMemberIds = Array.from(new Set(transactions.map(t => t.memberId)));

        // Find existing members
        const existingMembers = await prisma.member.findMany({
            where: { memberId: { in: distinctMemberIds } },
            select: { id: true, memberId: true, phone: true }
        });

        const existingMemberMap = new Map(existingMembers.map(m => [m.memberId, m]));
        const newMemberIds = distinctMemberIds.filter(id => !existingMemberMap.has(id));

        // Create new members in bulk
        if (newMemberIds.length > 0) {
            const newMembersData = newMemberIds.map(id => {
                const txn = transactions.find(t => t.memberId === id);
                return {
                    memberId: id,
                    name: txn?.memberName || "Unknown",
                    phone: txn?.phone || null,
                };
            });

            await prisma.member.createMany({
                data: newMembersData,
            });
        }

        // Re-fetch all members to get their internal IDs (CUIDs)
        const allMembers = await prisma.member.findMany({
            where: { memberId: { in: distinctMemberIds } },
            select: { id: true, memberId: true, phone: true }
        });

        const memberMap = new Map(allMembers.map(m => [m.memberId, m]));

        // 2. Prepare Transactions & Updates
        const transactionData = [];
        const memberStatsUpdates = new Map<string, {
            points: number;
            spent: number;
            count: number;
            phone?: string;
        }>();

        for (const txn of transactions) {
            const member = memberMap.get(txn.memberId);
            if (!member) continue;

            // Calculate points
            const pointsEarned = calculatePoints(txn.amount, conversionRate);

            // Calculate expiry
            const transactionDate = new Date(txn.transactionDate);
            let pointsExpiryDate: Date | null = null;

            if (expirationEnabled) {
                pointsExpiryDate = new Date(transactionDate);
                pointsExpiryDate.setDate(
                    pointsExpiryDate.getDate() + expirationDays
                );
            }

            // Add to transaction batch
            transactionData.push({
                memberId: member.id,
                transactionDate: transactionDate,
                amount: txn.amount,
                pointsEarned: pointsEarned,
                pointsExpiryDate: pointsExpiryDate,
            });

            // Aggregate Member Updates
            const stats = memberStatsUpdates.get(member.id) || { points: 0, spent: 0, count: 0 };
            stats.points += pointsEarned;
            stats.spent += txn.amount;
            stats.count += 1;

            // Check if we need to update phone (if member has no phone but txn does)
            if (txn.phone && !member.phone && !stats.phone) {
                stats.phone = txn.phone;
            }

            memberStatsUpdates.set(member.id, stats);
        }

        // 3. Execute Bulk Insert Transactions
        if (transactionData.length > 0) {
            await prisma.transaction.createMany({
                data: transactionData,
            });
        }

        // 4. Execute Member Updates (Batched Parallel)
        const mbUpdates = Array.from(memberStatsUpdates.entries()).map(([id, stats]) => {
            const data: any = {
                totalPoints: { increment: stats.points },
                totalSpent: { increment: stats.spent },
                transactionCount: { increment: stats.count },
            };
            if (stats.phone) {
                data.phone = stats.phone;
            }
            return prisma.member.update({
                where: { id },
                data: data,
            });
        });

        // Process updates in chunks to avoid overwhelming the DB connection
        const chunkSize = 50;
        for (let i = 0; i < mbUpdates.length; i += chunkSize) {
            await Promise.all(mbUpdates.slice(i, i + chunkSize));
        }

        revalidatePath("/transactions");
        revalidatePath("/customers");
        revalidatePath("/");
        return {
            success: true,
            message: `Successfully processed ${transactions.length} transactions`,
        };
    } catch (error) {
        console.error("Error uploading transactions:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Get top members by points
 */
export async function getTopMembers(limit: number = 10) {
    try {
        const members = await prisma.member.findMany({
            orderBy: {
                totalPoints: "desc",
            },
            take: limit,
            select: {
                id: true,
                memberId: true,
                name: true,
                phone: true,
                totalPoints: true,
                totalSpent: true,
                transactionCount: true,
            },
        });

        return { success: true, data: members };
    } catch (error) {
        console.error("Error getting top members:", error);
        return { success: false, error: "Failed to fetch top members" };
    }
}

/**
 * Get transaction statistics
 */
export async function getTransactionStats() {
    try {
        // Run queries sequentially to spare connection pool
        const totalTransactions = await prisma.transaction.count();
        const totalMembers = await prisma.member.count();

        const totalAmountAgg = await prisma.transaction.aggregate({
            _sum: {
                amount: true,
            },
        });

        const totalPointsAgg = await prisma.member.aggregate({
            _sum: {
                totalPoints: true,
            },
        });

        return {
            success: true,
            data: {
                totalTransactions,
                totalMembers,
                totalAmount: totalAmountAgg._sum.amount || 0,
                totalPoints: totalPointsAgg._sum.totalPoints || 0,
            },
        };
    } catch (error) {
        console.error("Error getting transaction stats:", error);
        return { success: false, error: "Failed to fetch statistics" };
    }
}

/**
 * Get all transactions with pagination
 */
export async function getTransactions(page: number = 1, limit: number = 20) {
    try {
        const skip = (page - 1) * limit;

        // Run sequentially to spare connection pool
        const transactions = await prisma.transaction.findMany({
            skip,
            take: limit,
            orderBy: {
                transactionDate: "desc",
            },
            include: {
                member: {
                    select: {
                        memberId: true,
                        name: true,
                    },
                },
            },
        });

        const total = await prisma.transaction.count();

        return {
            success: true,
            data: {
                transactions,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    } catch (error) {
        console.error("Error getting transactions:", error);
        return { success: false, error: "Failed to fetch transactions" };
    }
}

/**
 * Recalculate all points based on current conversion rate
 */
export async function recalculateAllPoints() {
    try {
        const conversionRate = await getPointConversionRate();

        // Get all transactions
        const transactions = await prisma.transaction.findMany({
            include: {
                member: true,
            },
        });

        // Reset all member points
        await prisma.member.updateMany({
            data: {
                totalPoints: 0,
            },
        });

        // Recalculate points for each transaction
        const updates: any[] = [];
        const memberPoints = new Map<string, number>();

        for (const txn of transactions) {
            const newPoints = calculatePoints(txn.amount, conversionRate);

            // Add transaction update to batch
            updates.push(
                prisma.transaction.update({
                    where: { id: txn.id },
                    data: { pointsEarned: newPoints },
                })
            );

            // Accumulate member points
            const currentPoints = memberPoints.get(txn.memberId) || 0;
            memberPoints.set(txn.memberId, currentPoints + newPoints);
        }

        // Add member updates to batch
        for (const [memberId, points] of memberPoints.entries()) {
            updates.push(
                prisma.member.update({
                    where: { id: memberId },
                    data: { totalPoints: points },
                })
            );
        }

        // Execute all updates in a single transaction
        // Split into chunks if there are too many updates to avoid database limits
        const chunkSize = 50;
        for (let i = 0; i < updates.length; i += chunkSize) {
            const chunk = updates.slice(i, i + chunkSize);
            await prisma.$transaction(chunk);
        }

        revalidatePath("/transactions");
        return {
            success: true,
            message: `Successfully recalculated points for ${transactions.length} transactions`,
        };
    } catch (error) {
        console.error("Error recalculating points:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
