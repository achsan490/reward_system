import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST() {
    try {
        // Check if admin already exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { email: "admin@reward.com" },
        });

        if (existingAdmin) {
            return NextResponse.json(
                { message: "Admin already exists" },
                { status: 400 }
            );
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

        return NextResponse.json({
            message: "Admin created successfully",
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
            },
        });
    } catch (error) {
        console.error("Error creating admin:", error);
        return NextResponse.json(
            { message: "Error creating admin" },
            { status: 500 }
        );
    }
}
