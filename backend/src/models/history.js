const db = require('../db').getDb();
const emptyHistory = { watched: {} };

module.exports = {
    fetch: () => {
        if (db.data.history) {
            return db.data.history;
        }
        db.data.history = { ...emptyHistory };
        return db.data.history;
    },
    log: ({ id, time = null, finished = false }) => {
        if (!Boolean(id)) return db.data.history;
        
        db.data.history.watched[id] = { time, finished };
        return db.data.history;
    },
    del: () => {
        db.data.history = {};
    }
};