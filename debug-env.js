const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.error('.env file does not exist');
    process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
console.log('--- .env content (escaped) ---');
console.log(JSON.stringify(content));
console.log('--- .env content (lines) ---');
content.split(/\r?\n/).forEach((line, i) => {
    console.log(`${i + 1}: ${JSON.stringify(line)}`);
});
