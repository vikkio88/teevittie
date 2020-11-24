const { response } = require('../../libs/formatters');

const all = (req, res) => {
    const catalog = [
        { some: 'stuff' },
        { some: 'stuff' },
        { some: 'stuff' },
    ];
    return response(res, catalog);
};

module.exports = {
    all
};