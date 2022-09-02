const catalogFolder = process.argv.slice(2)[0];
const dirExists = require('fs').existsSync(catalogFolder);
if (!Boolean(catalogFolder) || !dirExists) throw Error(`Tee needs a valid catalog folder, passed: ${catalogFolder}`);


const express = require('express');
const app = express();
const cors = require('cors');
const catalog = require('./models/catalog');
const history = require('./models/history');

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/ping', (_, res) => res.json({ pong: 1 }));
app.get('/catalog', (_, res) => res.json({ catalog: catalog.fromDir(catalogFolder), history: history.fetch(catalogFolder) }));

app.post('/history', (req, res) => {
    const { body } = req;
    res.json({ history: history.log(body) });
});

app.put('/history', (_, res) => {
    history.persist(catalogFolder);
    res.sendStatus(200);
});
app.delete('/history', (_, res) => {
    history.del(catalogFolder);
    res.sendStatus(200);
});

app.listen(process.env.PORT || 3001);