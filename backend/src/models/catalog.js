const dirTree = require('directory-tree');
const { date } = require('../libs/formatters');
const db = require('../db').getDb();
const format = require('../libs/treeFormat');

const { VIDEO_FILE_EXTENSIONS } = require('./enums');


const fromDir = directory => {
    // need to check the latest indexedTime here
    if (!Boolean(db.data.catalog)) {
        const tree = dirTree(directory, {
            extensions: new RegExp(`\.(${VIDEO_FILE_EXTENSIONS.join('|')})$`)
        });
        const { formatted, indexed, seasonsMap } = format(tree);
        db.data.catalog = formatted;
        db.data.indexed = indexed;
        db.data.seasonsMap = seasonsMap;
        db.data.indexedTime = date();
    }

    return { catalog: db.data.catalog, seasonsMap: db.data.seasonsMap };
};

module.exports = {
    fromDir
};