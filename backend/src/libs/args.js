const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { DEFAULT_PORT } = require('../config');

const parse = () => {
    const argv = yargs(hideBin(process.argv)).argv;
    const catalogFolder = argv._.length > 0 ? argv._[0] : (argv?.folder ?? './');
    const noCatalogSpecified = !Boolean(argv._.length > 0 ? argv._[0] : (argv?.folder ?? false));
    const port = parseInt(process.env.PORT) || (argv?.port ?? DEFAULT_PORT);
    const browser = noCatalogSpecified ? true : Boolean(argv?.browser);
    const version = Boolean(argv?.version || argv?.v);
    const help = Boolean(argv?.help || argv?.h);
    return { catalogFolder, port, browser, request: { version, help }, };
};

const helpBanner = `
teevittie cli help:

    --folder  - specify catalog folder ( --folder='Documents/)', if none passes it will be using current folder.

    --port    - specify the port, default ${DEFAULT_PORT}, ( --port=3030 ).

    --browser - open the browser automatically (on if no folder specified).

    -v        - it will show you the version of teevittie.

    -h        - shows this help.

    
    for more info: https://github.com/vikkio88/teevittie
`;

module.exports = {
    parse, helpBanner
};