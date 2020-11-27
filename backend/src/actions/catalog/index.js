const { MEDIA_PATH } = process.env;
const { response } = require('../formatters');
const { fromDir } = require('../../models/catalog');

const all = (req, res) => {
    const catalog = fromDir(MEDIA_PATH);
    return response(res, catalog, { total: catalog.length });
};

module.exports = {
    all
};