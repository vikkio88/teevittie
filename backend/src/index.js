if (process.env.NODE_ENV === 'development') require('dotenv').config();
const cors = require('micro-cors')();
const { send } = require('micro');
const { router, get, post, withNamespace } = require('microrouter');

const { misc, catalog } = require('./actions');

const api = withNamespace('/api');

module.exports = cors(
    router(
        api(
            get('/ping', misc.pong),
            get('/catalog', catalog.all),
        ),
        get('/', misc.fallback),

        get('/*', (req, res) => send(res, 404)),
        post('/*', (req, res) => send(res, 404))
    )
);
