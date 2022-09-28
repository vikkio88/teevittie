const db = require('../db').getDb();
const fs = require('fs');
const which = require('which');
const Transcoder = require('stream-transcoder');
const path = require('path');
const mime = require('mime-types');
const { cast, command } = require('../libs/chromecast');


const getFilePathForEpisode = (id, db) => {
    const { path: filePath = null } = db.data.indexed[id] || {};
    return filePath;
};

const file = (req, res) => {
    const { id } = req.params;
    const filePath = getFilePathForEpisode(id, db);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            status: 404,
            message: "Video File not Found",
        });
    }

    const mimeType = mime.lookup(filePath);

    const completeFilePath = path.join(process.cwd(), filePath);
    let hasffmpeg = true;
    try {
        hasffmpeg = Boolean(which.sync('ffmpeg'));
    } catch {
        hasffmpeg = false;
    }

    if (mimeType.includes('mp4') || !hasffmpeg) {
        res.sendFile(completeFilePath);
        return;
    }

    const trans = new Transcoder(completeFilePath)
        .videoCodec('h264')
        .format('mp4')
        .custom('strict', 'experimental')
        .on('finish', () => {
            console.log('finished transcoding');
            res.end();
        })
        .on('error', err => {
            console.log('error transcoding', err);
            res.end();
        });

    let args = trans._compileArguments();
    args = ['-i', '-'].concat(args);
    args.push('pipe:1');
    trans.stream().pipe(res);
};

const stream = (req, res) => {
    const chunkSize = 3000000;
    const { id } = req.params;
    const filePath = getFilePathForEpisode(id, db);

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
        "Content-Type": mime.lookup(filePath),
        "Content-Length": contentLength,
        "Content-Range": `bytes ${start}-${end}/${fileSize}`
    });

    const videoStream = fs.createReadStream(filePath, { start, end });

    videoStream.pipe(res);
};

const subtitles = (req, res) => {
    const { id } = req.params;
    const episode = db.data.indexed[id];
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

const castRequest = (urls) => (req, res) => {
    const { id } = req.params;

    const episode = db.data.indexed[id];
    cast(episode, urls);
    res.sendStatus(202);
};

const castCommand = (req, res) => {
    const { body } = req;
    command(body.command);
    res.sendStatus(202);

};



module.exports = { stream, subtitles, file, castRequest, castCommand };