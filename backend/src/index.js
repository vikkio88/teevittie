const { PORT = 3001 } = process.env;
const catalogFolder = process.argv.slice(2)[0];
const dirExists = require('fs').existsSync(catalogFolder);
if (!Boolean(catalogFolder) || !dirExists) throw Error(`Tee needs a valid catalog folder, passed: ${catalogFolder}`);
const db = require('./db').getDb(catalogFolder);

// every 5 Minutes
const DB_PERSIST_INTERVAL = 5 * 60 * 1000;

const { date } = require('./libs/formatters');
const log = message => console.log(`${date()} - ${message}`);

const persistInterval = setInterval(() => {
    log(`\t*** Saving Db to file...`);
    db.write();
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

app.get('/ping', (_, res) => res.json({ pong: 1 }));
app.get('/catalog', (_, res) => {
    const history = historyRepo.fetch();
    const { catalog, seasonsMap } = catalogRepo.fromDir(catalogFolder);
    res.json({ catalog, seasonsMap, history });
});

app.get('/stream/:id', stream);

app.post('/history', (req, res) => {
    const { body } = req;
    res.json({ history: historyRepo.log(body) });
});

app.delete('/history', (_, res) => {
    history.del();
    res.sendStatus(200);
});

app.post('/shutdown', (_, res) => {
    log('received shutdown request');
    res.sendStatus(202);
    clearInterval(persistInterval);
    db.write();
    process.exit(0);
});

const server = app.listen(PORT || 3001);
const shutDown = () => {
    console.log('');
    log('Received kill signal, shutting down gracefully');
    log(`\t*** Saving Db to file...`);
    clearInterval(persistInterval);
    db.write();
    server.close(() => {
        log('- closed out remaining connections');
        process.exit(0);
    });
};
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
process.on('uncaughtException', exception => {
    console.error('uncaughtException', exception);
    log(`Uncaught Exception`);
});