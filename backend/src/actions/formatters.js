const { send } = require('micro');

const response = (res, payload, meta = {}) => {
    return send(res, 200, {
        meta,
        payload
    });
};

const unauthorized = (res, message = 'Unauthorized') => {
    return send(res, 401, {
        message
    });
};

const notFound = (res, message = 'NotFound') => {
    return send(res, 404, {
        message
    });
};

const unprocessable = (res, message = 'Wrong Payload', errors = []) => {
    return send(res, 422, {
        message,
        errors
    });
};

module.exports = {
    response,
    unauthorized,
    notFound,
    unprocessable
};