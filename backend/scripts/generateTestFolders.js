const fs = require('fs');
const path = require('path');
const randomString = () => Math.random().toString(36).substring(7);
const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
const randomBool = (perc = 50) => randomInt(0, 100) >= perc;

const dir = process.argv.slice(2)[0] || './tmp';

if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
}

fs.mkdirSync(dir);
const shows = randomInt(3, 8);
console.log(`Generating ${shows} shows`);
for (let i = 0; i < shows; i++) {
    const show = `Show ${randomString()}`;
    console.log(`  generating show: ${show}`);
    fs.mkdirSync(path.join(dir, show));
    const seasons = randomInt(1, 7);
    console.log(`       generating ${seasons} seasons`);
    for (let j = 0; j < seasons; j++) {
        const season = `Season ${j + 1}`;
        console.log(`       generating season ${season}`);
        fs.mkdirSync(path.join(dir, show, season));
        const episodes = randomInt(2, 15);
        console.log(`       generating ${episodes} episodes`);
        for (let k = 0; k < episodes; k++) {
            const episodeName = `Episode ${randomString()} s0${j + 1}e${k + 1}`;
            const episode = `${episodeName}.mp4`;
            console.log(`       generating episode: ${episode}`);
            const episodeFilepath = path.join(dir, show, season, episode);
            console.log('FILE:', episodeFilepath);
            fs.copyFileSync('scripts/example.mp4', episodeFilepath);
            if (randomBool()) {
                console.log(`       -- adding subtitle to episode: ${episode}`);
                const subtitleFilePath = path.join(dir, show, season, `${episodeName}.vtt`);
                fs.copyFileSync('scripts/example.vtt', subtitleFilePath);
            }


        }
    }
}