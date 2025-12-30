import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function testLogin() {
    const email = "admin@reward.com";
    const password = "admin123";

    console.log("🔍 Testing login for:", email);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // 1. Check if admin exists
    console.log("1️⃣ Checking if admin exists in database...");
    const admin = await prisma.admin.findUnique({
        where: { email },
    });

    if (!admin) {
        console.log("❌ Admin NOT found in database!");
        console.log("\n📋 All admins in database:");
        const allAdmins = await prisma.admin.findMany();
        console.log(allAdmins);
        return;
    }

    console.log("✅ Admin found!");
    console.log("   ID:", admin.id);
    console.log("   Email:", admin.email);
    console.log("   Name:", admin.name);
    console.log("   Password (hashed):", admin.password.substring(0, 30) + "...");
    console.log("");

    // 2. Test password
    console.log("2️⃣ Testing password...");
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
        console.log("❌ Password does NOT match!");
        console.log("\nℹ️  Trying to hash the password and compare:");
        const hashedTest = await bcrypt.hash(password, 10);
        console.log("   Test hash:", hashedTest);
        return;
    }

    console.log("✅ Password matches!");
    console.log("");

    // 3. Test what would be returned
    console.log("3️⃣ Data that would be returned to NextAuth:");
    const authData = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
    };
    console.log(JSON.stringify(authData, null, 2));
    console.log("");

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ All checks passed! Login should work.");
    console.log("");
    console.log("🔑 Use these credentials:");
    console.log("   Email:", email);
    console.log("   Password:", password);
}

testLogin()
    .catch((e) => {
        console.error("\n❌ Error during test:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
