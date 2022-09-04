const fs = require('fs');

const dir = process.argv.slice(2) || './tmp';

if (fs.existsSync(dir)) {
    fs.rmdirSync(dir, { recursive: true });
}