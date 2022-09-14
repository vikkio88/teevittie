const { DB_PERSIST_INTERVAL } = require('../config');
const { log } = require('../libs/logger');

const init = (catalogFolder, { commitHash, pkgVersion, urls }) => {
    const dirExists = require('fs').existsSync(catalogFolder);
    if (!Boolean(catalogFolder) || !dirExists) throw Error(`Tee needs a valid catalog folder, passed: ${catalogFolder}`);
    const db = require('../db').getDb(catalogFolder);

    const persistInterval = setInterval(() => {
        log(`*** Saving Db to file...`);
        log(`${db.write() ? 'saved to file' : 'no need to write to file'}`);
    }, DB_PERSIST_INTERVAL);

    const makeApp = require('../server');
    const app = makeApp(catalogFolder, { persistInterval, commitHash, pkgVersion, urls });
    const shutDown = server => () => {
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

    return {
        app, shutDown
    };
};
module.exports = init;