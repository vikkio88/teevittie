#!/usr/bin/env node

const { parse, helpBanner } = require('./libs/args');
const { log } = require('./libs/logger');
const init = require('./libs/init');
const address = require('address');
const openBrowser = require('./libs/openBrowser');
const { BANNER } = require('./libs/banner');
const pkg = require('../package.json');
const meta = require('../build/assets/meta.json');

const { catalogFolder, request, browser, port } = parse();
const bannerWithVersion = `${BANNER}\t\t(v${pkg.version} - ${meta.version})\n\n`;
const urls = {
    local: `http://localhost:${port}`,
    lan: `http://${address.ip()}:${port}`
};
if (request.version) {
    console.log(bannerWithVersion);
    process.exit(0);
}

if (request.help) {
    console.log(bannerWithVersion);
    console.log(helpBanner);
    process.exit(0);
}
const { app, shutDown } = init(catalogFolder, { commitHash: meta.version, pkgVersion: pkg.version, urls });
const server = app.listen(port);

process.on('SIGTERM', shutDown(server));
process.on('SIGINT', shutDown(server));
process.on('uncaughtException', exception => {
    // when I move to chalk might want to log.error red
    log('uncaughtException');
    console.error(exception);
    // might want to disable this if it is too much to kill the app
    process.exit(1);
});

console.log(`\n${bannerWithVersion}listening on port ${port}\ncatalog folder: ${catalogFolder}\n\n\t ${urls.local}/\n\t ${urls.lan}/\n\n\nEVENT LOG:`);
log(`server up an running.`);

if (browser) openBrowser(`${urls.local}`);
