const db = require('../db').getDb();
const fs = require('fs');
const path = require('path');

const stream = (req, res) => {
    const chunkSize = 3000000;
    const { id } = req.params;
    const filePath = db.data.indexed[id];

    const range = req.headers.range;
    if (!range) {
        return res.status(400).json({
            status: 400,
            message: "Range Header is Required",
        });
    }

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            status: 404,
            message: "Video File not Found",
        });
    }

    const fileSize = fs.statSync(filePath).size;

    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, fileSize - 1);
    const contentLength = end - start + 1;

    res.writeHead(206, {
        "Accept-Ranges": "bytes",
        "Content-Type": "video/mp4",
        "Content-Length": contentLength,
        "Content-Range": `bytes ${start}-${end}/${fileSize}`
    });

    const videoStream = fs.createReadStream(filePath, { start, end });

    videoStream.pipe(res);
};

const subtitles = (req, res) => {
    const { id } = req.params;

    //@TODO Fix this shit
    const ids = id.split('.');
    const episode = db.data.catalog.find(s => s.id === ids[0])?.seasons?.find(s => s.id === ids[1])?.episodes.find(e => e.id === ids[2]) ?? null;
    if (!episode || !Boolean(episode.subs && episode.subs.length)) {
        res.sendStatus(404);
        return;
    }
    // this is crap
    // we also send track index as there might be more subs, 
    // at the moment I get only 1, the first
    const subTrack = episode.subs[0];
    const subsFilepath = path.join(process.cwd(), subTrack.path);
    if (!fs.existsSync(subsFilepath)) {
        return res.status(404).json({
            status: 404,
            message: "Subtitles File not Found",
        });
    }


    res.sendFile(subsFilepath);//, { headers: { 'Content-Type': 'text/vtt' } });// move to ENUMS
};



module.exports = { stream, subtitles };