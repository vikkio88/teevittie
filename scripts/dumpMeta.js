const version = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString().trim();
console.log(JSON.stringify({ version }));