const fs = require('fs');
const path = require('path');
const randomString = () => Math.random().toString(36).substring(7);
const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

const dir = './tmp';

if (fs.existsSync(dir)) {
    fs.rmdirSync(dir, { recursive: true });
}

fs.mkdirSync(dir);
const shows = randomInt(2, 5);
console.log(`Generating ${shows} shows`);
for (let i = 0; i < shows; i++) {
    const show = `Show ${randomString()}`;
    console.log(`  generating show: ${show}`);
    fs.mkdirSync(path.join(dir, show));
    const seasons = randomInt(1, 4);
    console.log(`       generating ${seasons} seasons`);
    for (let j = 0; j < seasons; j++) {
        const season = `Season ${j + 1}`;
        console.log(`       generating season ${season}`);
        fs.mkdirSync(path.join(dir, show, season));
        const episodes = randomInt(1, 4);
        console.log(`       generating ${episodes} episodes`);
        for (let k = 0; k < episodes; k++) {
            const episode = `Episode ${randomString()} s0${j + 1}e${k + 1}.mp4`;
            console.log(`       generating episode: ${episode}`);
            const filepath = path.join(dir, show, season, episode);
            console.log('FILE:', filepath);
            fs.copyFileSync('scripts/example.mp4', filepath);
        }
    }
}