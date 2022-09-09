const { date } = require('../libs/formatters');

const db = require('../db').getDb();
const emptyHistory = { watched: {} };

module.exports = {
    fetch: () => {
        const data = db.data;
        if (data.history) {
            return data.history;
        }
        data.history = { ...emptyHistory };
        db.save(data);

        return db.data.history;
    },
    log: ({ id, time = null, finished = false }) => {
        if (!Boolean(id)) return db.data.history;
        const data = db.data;
        data.history.watched[id] = { time, finished, timestamp: date(), };
        db.save(data);

        return db.data.history;
    },
    del: () => {
        const data = db.data.history;
        data.history = { ...emptyHistory };
        db.save(data);
    }
};