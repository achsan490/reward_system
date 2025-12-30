"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Get all system settings
 */
export async function getSettings() {
    try {
        const settings = await prisma.systemSetting.findMany({
            orderBy: {
                key: "asc",
            },
        });

        return { success: true, data: settings };
    } catch (error) {
        console.error("Error getting settings:", error);
        return { success: false, error: "Failed to fetch settings" };
    }
}

/**
 * Update a system setting
 */
export async function updateSetting(key: string, value: string) {
    try {
        const setting = await prisma.systemSetting.upsert({
            where: { key },
            update: { value },
            create: {
                key,
                value,
                label: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
                type: "string",
            },
        });

        revalidatePath("/settings");
        return { success: true, data: setting };
    } catch (error) {
        console.error("Error updating setting:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Get point conversion rate
 */
export async function getPointConversionRate() {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: "point_conversion_rate" },
        });

        if (!setting) {
            // Create default
            const newSetting = await prisma.systemSetting.create({
                data: {
                    key: "point_conversion_rate",
                    value: "5000",
                    label: "Point Conversion Rate",
                    type: "number",
                },
            });
            return { success: true, data: parseFloat(newSetting.value) };
        }

        return { success: true, data: parseFloat(setting.value) };
    } catch (error) {
        console.error("Error getting point conversion rate:", error);
        return { success: false, error: "Failed to fetch conversion rate" };
    }
}

/**
 * Update point conversion rate
 */
export async function updatePointConversionRate(rate: number) {
    try {
        await prisma.systemSetting.upsert({
            where: { key: "point_conversion_rate" },
            update: { value: rate.toString() },
            create: {
                key: "point_conversion_rate",
                value: rate.toString(),
                label: "Point Conversion Rate",
                type: "number",
            },
        });

        revalidatePath("/settings");
        revalidatePath("/transactions");
        return { success: true, message: "Conversion rate updated successfully" };
    } catch (error) {
        console.error("Error updating conversion rate:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Reset all transaction data
 * WARNING: This will delete all transactions and reset member points
 */
export async function resetTransactionData() {
    try {
        await prisma.$transaction([
            // Delete all transactions
            prisma.transaction.deleteMany(),

            // Reset member stats
            prisma.member.updateMany({
                data: {
                    totalPoints: 0,
                    totalSpent: 0,
                    transactionCount: 0,
                },
            }),
        ]);

        revalidatePath("/settings");
        revalidatePath("/transactions");
        revalidatePath("/reward-determination");

        return { success: true, message: "All transaction data has been reset successfully" };
    } catch (error) {
        console.error("Error resetting transaction data:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
