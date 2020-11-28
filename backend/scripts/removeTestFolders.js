const fs = require('fs');

const dir = './tmp';

if (fs.existsSync(dir)) {
    fs.rmdirSync(dir, { recursive: true });
}