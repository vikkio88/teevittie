const catalogFolder = process.argv.slice(2)[0];
const dirExists = require('fs').existsSync(catalogFolder);
if (!Boolean(catalogFolder) || !dirExists) throw Error(`Tee needs a valid catalog folder, passed: ${catalogFolder}`);
const db = require('./db').getDb(catalogFolder);

const DB_PERSIST_INTERVAL = 60 * 1000;

const persistInterval = setInterval(() => {
    console.log(`\t*** Saving Db to file...`);
    db.write();
}, DB_PERSIST_INTERVAL);

const express = require('express');
const app = express();
const cors = require('cors');
const catalogRepo = require('./models/catalog');
const historyRepo = require('./models/history');
const stream = require('./models/stream');
const { clearInterval } = require('timers');

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/ping', (_, res) => res.json({ pong: 1 }));
app.get('/catalog', (_, res) => {
    const catalog = catalogRepo.fromDir(catalogFolder);
    const history = historyRepo.fetch();
    res.json({ catalog, history });
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
    console.log('received shutdown request');
    res.sendStatus(202);
    clearInterval(persistInterval);
    db.write();
    process.exit(0);
});

const server = app.listen(process.env.PORT || 3001);
const shutDown = () => {
    console.log('');
    console.log('Received kill signal, shutting down gracefully');
    console.log(`\t*** Saving Db to file...`);
    clearInterval(persistInterval);
    db.write();
    server.close(() => {
        console.log('- closed out remaining connections');
        process.exit(0);
    });
};
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
process.on('uncaughtException', exception => {
    console.error('uncaughtException', exception);
});