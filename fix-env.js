const fs = require('fs');
const content = `DATABASE_URL="mysql://avnadmin:AVNS_C-pooYVxrrTSV5ec8dV@mysql-3c5743d7-reward-app.h.aivencloud.com:22974/defaultdb?ssl-mode=REQUIRED"

NEXTAUTH_SECRET="7hqXX31gL07yj/MgPqbtFWMu0kG9NnIBvIE5sO+kbZs="
AUTH_SECRET="7hqXX31gL07yj/MgPqbtFWMu0kG9NnIBvIE5sO+kbZs="

NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
`;

try {
    fs.writeFileSync('.env', content, 'utf8');
    console.log('✅ .env file successfully repaired.');
} catch (err) {
    console.error('❌ Failed to write .env:', err.message);
}
