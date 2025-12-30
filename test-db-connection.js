const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    const dbUrl = process.env.DATABASE_URL;
    console.log('Testing connection to:', dbUrl.replace(/:[^:@]+@/, ':****@')); // Hide password

    try {
        const connection = await mysql.createConnection(dbUrl);
        console.log('✅ Success! Connected to database.');
        await connection.end();
    } catch (error) {
        console.error('❌ Connection failed:');
        console.error('Code:', error.code);
        console.error('Message:', error.message);

        if (error.code === 'ECONNREFUSED' || error.original?.code === 'ECONNREFUSED') {
            console.log('💡 TIP: Check if the Host and Port are correct.');
        } else if (error.code === 'ETIMEDOUT') {
            console.log('💡 TIP: This usually means Aiven blocked the IP. Check "Allow IP" settings.');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('💡 TIP: Check Username and Password.');
        } else if (error.message.includes('SSL')) {
            console.log('💡 TIP: Check SSL settings (ssl-mode=REQUIRED is usually needed).');
        }
    }
}

testConnection();
