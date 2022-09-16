const dirTree = require('directory-tree');
const { date } = require('../libs/formatters');
const db = require('../db').getDb();
const { format } = require('../libs/treeFormat');

const { VIDEO_FILE_EXTENSIONS } = require('./enums');

// 20 minutes cache of catalog
const CATALOG_CACHE_TIMEOUT = 20 * 60 * 1000;
const hasCacheExpired = ({ indexedTime = null }) => {
    if (!Boolean(indexedTime)) return true;

    const now = new Date();
    const lastIndexed = new Date(indexedTime);

    return (now - lastIndexed) > CATALOG_CACHE_TIMEOUT;
};

const fromDir = directory => {
    const data = db.data;
    if (!Boolean(data.catalog) || hasCacheExpired(db.data)) {
        const tree = dirTree(directory, {
            extensions: new RegExp(`\.(${VIDEO_FILE_EXTENSIONS.join('|')})$`)
        });
        const { formatted, indexed, seasonsMap } = format(tree);
        data.catalog = formatted;
        data.indexed = indexed;
        data.seasonsMap = seasonsMap;
        data.indexedTime = date();
        db.save(data);
    }

    return { catalog: db.data.catalog, seasonsMap: db.data.seasonsMap };
};

module.exports = {
    fromDir
};