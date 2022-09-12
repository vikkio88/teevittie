#!/usr/bin/env node

const { PORT = 3001 } = process.env;
const { BANNER } = require('./libs/banner');
const pkg = require('../package.json');
const meta = require('../build/assets/meta.json');

const catalogFolder = process.argv.slice(2)[0];
const dirExists = require('fs').existsSync(catalogFolder);
if (!Boolean(catalogFolder) || !dirExists) throw Error(`Tee needs a valid catalog folder, passed: ${catalogFolder}`);
const db = require('./db').getDb(catalogFolder);

// every 5 Minutes
const DB_PERSIST_INTERVAL = 5 * 60 * 1000;
// maybe move this to its own component
const { date } = require('./libs/formatters');
const log = message => console.log(`${date()} - ${message}`);

const persistInterval = setInterval(() => {
    log(`*** Saving Db to file...`);
    log(`${db.write() ? 'saved to file' : 'no need to write to file'}`);
}, DB_PERSIST_INTERVAL);

const express = require('express');
const app = express();
const cors = require('cors');
const catalogRepo = require('./models/catalog');
const historyRepo = require('./models/history');
const stream = require('./models/stream');

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(__dirname + '/../build'));
app.use('/show/*', express.static(__dirname + '/../build'));
app.use('/episode/*', express.static(__dirname + '/../build'));

const api = express.Router();


api.get('/ping', (_, res) => res.json({ pong: 1 }));
api.get('/catalog', (_, res) => {
    log(`requested catalog.`);
    const history = historyRepo.fetch();
    const { catalog, seasonsMap } = catalogRepo.fromDir(catalogFolder);
    res.json({ catalog, seasonsMap, history });
});

api.get('/stream/:id', stream);

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
    db.write();
    res.sendStatus(202);
    process.exit(0);
});

app.use('/api', api);

const server = app.listen(PORT || 3001);
const shutDown = () => {
    console.log('\n\n');
    log('Received kill signal, shutting down gracefully');
    log(`*** Saving Db to file...`);
    clearInterval(persistInterval);
    db.write();
    server.close(() => {
        log('closed out remaining connections');
        process.exit(0);
    });
};
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
process.on('uncaughtException', exception => {
    // when I move to chalk might want to log.error red
    // console.error('uncaughtException', exception);
    log('uncaughtException', exception);
    log(`Uncaught Exception`);
});

const address = require('address');
console.log(`\n${BANNER}\t\t(v${pkg.version} - ${meta.version})\n\nlistening on port ${PORT}\ncatalog folder: ${catalogFolder}\n\n\t http://localhost:${PORT}/\n\t http://${address.ip()}:${PORT}/\n\n\nEVENT LOG:`);
log(`server up an running.`);
