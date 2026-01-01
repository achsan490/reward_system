const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const content = fs.readFileSync(envPath, 'utf8');

console.log('--- Raw Content (Buffer Hex) ---');
console.log(fs.readFileSync(envPath).toString('hex').match(/.{1,64}/g).join('\n'));

console.log('\n--- Extraction Attempt ---');
const lines = content.split(/\r?\n/);
lines.forEach((line, i) => {
    console.log(`Line ${i + 1}: ${JSON.stringify(line)}`);
});

// Try to find components
const passMatch = content.match(/avnadmin:(AVNS_[^@]+)@/);
const hostMatch = content.match(/@([^:/]+):/);
const secretMatch = content.match(/NEXTAUTH_SECRET="([^"]+)"/);

console.log('\n--- Detected Components ---');
console.log('User: avnadmin');
console.log('Password:', passMatch ? passMatch[1] : 'NOT FOUND');
console.log('Host:', hostMatch ? hostMatch[1] : 'NOT FOUND');
console.log('Secret:', secretMatch ? secretMatch[1] : 'NOT FOUND');
