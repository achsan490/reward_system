const { PrismaClient } = require("./src/generated/prisma");

const prisma = new PrismaClient();

async function checkAdmin() {
    console.log("Checking admin accounts in database...");
    try {
        const admins = await prisma.admin.findMany();

        console.log(`Found ${admins.length} admin(s):`);
        admins.forEach((admin, i) => {
            console.log(`${i + 1}. Email: ${admin.email}, Name: ${admin.name}`);
        });

        if (admins.length === 0) {
            console.log("⚠️ No admins found. Database might be empty.");
        }
    } catch (error) {
        console.error("❌ Prisma Error Detail:");
        console.error("Code:", error.code);
        console.error("Message:", error.message);
        if (error.meta) {
            console.error("Meta:", JSON.stringify(error.meta, null, 2));
        }
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmin();
