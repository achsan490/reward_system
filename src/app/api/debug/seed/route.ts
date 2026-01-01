import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        console.log("Starting debug seed...");

        // Check if admin already exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { email: "admin@reward.com" },
        });

        if (existingAdmin) {
            return NextResponse.json({
                success: true,
                message: "Admin already exists!",
                email: existingAdmin.email
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash("Admin123!", 10);

        // Create admin
        const admin = await prisma.admin.create({
            data: {
                email: "admin@reward.com",
                password: hashedPassword,
                name: "Administrator",
            },
        });

        console.log("Admin created successfully:", admin.email);

        return NextResponse.json({
            success: true,
            message: "Admin created successfully!",
            email: admin.email
        });
    } catch (error: any) {
        console.error("Debug seed error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
