import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting seed...");

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
        where: { email: "admin@reward.com" },
    });

    if (existingAdmin) {
        console.log("Admin already exists!");
        return;
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

    console.log("Admin created successfully:", {
        id: admin.id,
        email: admin.email,
        name: admin.name,
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
