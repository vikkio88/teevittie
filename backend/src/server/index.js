const express = require('express');
const cors = require('cors');
const { log } = require('../libs/logger');
const catalogRepo = require('../models/catalog');
const historyRepo = require('../models/history');
const { stream, subtitles } = require('../models/video');

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

    api.get('/stream/:id', stream);
    api.get('/subs/:id', subtitles);

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

    app.use('/api', api);
    return app;
};

module.exports = makeApp;