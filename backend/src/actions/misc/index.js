const { response } = require('../../libs/formatters');

const pong = (req, res) => {
    return response(res, { pong: true, env: process.env.LABEL });
};

const fallback = (req, res) => {
    return '<head><meta charset="UTF-8"></head><body style="display:flex;' +
        'flex-direction:column; align-items: center; justify-content: center;">' +
        '(╥﹏╥)<span style="margin-top:30px">Nope!</span></body>';
};

module.exports = {
    pong,
    fallback
};