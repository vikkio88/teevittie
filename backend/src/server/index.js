const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const { log } = require('../libs/logger');
const catalogRepo = require('../models/catalog');
const historyRepo = require('../models/history');
const { stream, file, subtitles, castRequest, castCommand } = require('../models/video');

let io = null;

const commandHandler = console.log;

const initWs = io => {
    log('ws: starting up');
    io.on('connection', (socket) => {
        const id = socket.client.id;
        console.log(`ws: ${id} connected`);
        socket.on('disconnect', () => {
            console.log(`ws: ${id} disconnected`);
        });

        socket.on('command', commandHandler);
    });
};

const makeApp = (catalogFolder, args) => {
    const { pkgVersion, commitHash, persistInterval, urls } = args;
    const app = express();
    app.disable('x-powered-by');
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/', express.static(__dirname + '/../../build'));
    app.use('/show/*', express.static(__dirname + '/../../build'));
    app.use('/episode/*', express.static(__dirname + '/../../build'));

    const api = express.Router();
    api.get('/ping', (_, res) => res.json({ pong: 1 }));

    api.get('/boot', (_, res) => {
        log(`booting up.`);
        const history = historyRepo.fetch();
        const { catalog, seasonsMap } = catalogRepo.fromDir(catalogFolder);
        res.json({ catalog, seasonsMap, history, meta: { version: `v${pkgVersion} - ${commitHash}`, urls } });
    });

    api.get('/catalog', (_, res) => {
        log(`requested catalog.`);
        const { catalog, seasonsMap } = catalogRepo.fromDir(catalogFolder);
        res.json({ catalog, seasonsMap });
    });

    api.get('/file/:id', file);
    api.get('/stream/:id', stream);
    api.get('/subs/:id', subtitles);

    api.put('/cast', castCommand);
    api.post('/cast/:id', castRequest(urls));

    api.put('/history', (req, res) => {
        const { body } = req;
        res.json({ history: historyRepo.log(body) });
    });

    api.patch('/history', (req, res) => {
        const { body } = req;
        res.json({ history: historyRepo.logMany(body) });
    });

    api.delete('/history', (_, res) => {
        log(`deleted history.`);
        historyRepo.del();
        res.sendStatus(200);
    });

    api.post('/shutdown', (_, res) => {
        log('received shutdown request');
        clearInterval(persistInterval);
        require('../db').getDb().write();
        res.sendStatus(202);
        process.exit(0);
    });

    api.put('/ws', (req, res) => {
        if (!io) {
            io = new Server(server, {
                cors: { origin: [urls.local, urls.lan, 'http://localhost:3000'], methods: ['GET', 'POST'] }
            });
            initWs(io);
            res.sendStatus(201);
            return;
        }
        res.sendStatus(200);
    });


    app.use('/api', api);
    const server = http.createServer(app);


    return server;
};

module.exports = makeApp;