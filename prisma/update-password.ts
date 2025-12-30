import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Updating admin password...");

    const email = "admin@reward.com";
    const newPassword = "admin123";

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin password
    const admin = await prisma.admin.update({
        where: { email },
        data: { password: hashedPassword },
    });

    console.log("✅ Password updated successfully!");
    console.log({
        email: admin.email,
        name: admin.name,
        updatedAt: admin.updatedAt,
    });
    console.log("\nNew credentials:");
    console.log("Email:", email);
    console.log("Password:", newPassword);
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
