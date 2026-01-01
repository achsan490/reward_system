require('dotenv').config();

async function testConnection() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('❌ DATABASE_URL is not defined in .env');
        return;
    }
    console.log('Testing connection to:', dbUrl.replace(/:[^:@]+@/, ':****@')); // Hide password

    try {
        console.log('--- Testing with mysql2 (Optional) ---');
        const mysql = require('mysql2/promise');
        const connection = await mysql.createConnection(dbUrl);
        console.log('✅ Success! Connected via mysql2.');
        await connection.end();
    } catch (mysqlError) {
        if (mysqlError.code === 'MODULE_NOT_FOUND') {
            console.log('ℹ️ mysql2 not found, skipping direct driver test.');
        } else {
            console.error('❌ mysql2 Connection failed:', mysqlError.message);
        }

        console.log('\n--- Testing with Prisma Client (Primary) ---');
        try {
            const { PrismaClient } = require('./src/generated/prisma');
            const prisma = new PrismaClient();
            await prisma.$connect();
            console.log('✅ Success! Connected via Prisma.');

            // Try a simple query
            const adminCount = await prisma.admin.count();
            console.log(`📊 Current Admin count: ${adminCount}`);

            await prisma.$disconnect();
        } catch (prismaError) {
            console.error('❌ Prisma Connection failed:', prismaError.message);

            if (prismaError.message.includes('Can\'t reach database server')) {
                console.log('\n💡 TIP: This usually means Aiven blocked your IP. Please whitelist your current IP in the Aiven Dashboard.');
            } else if (prismaError.code === 'MODULE_NOT_FOUND') {
                console.log('ℹ️ Prisma Client module not found. Try running "npx prisma generate"');
            }
        }
    }
}

testConnection();
