const { MAX_LATEST_EPISODES } = require('../config');
const { date } = require('../libs/formatters');
const { latestStackHelper } = require('../libs/latestStack');

const db = require('../db').getDb();
const emptyHistory = { watched: {}, latest: [] };


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
    logMany(rows) {
        const data = db.data;
        for (const { time, id, finished } of rows) {
            data.history.watched[id] = { time, finished, total: null, timestamp: date(), info: null };
        }
        db.save(data);

        return db.data.history;
    },
    log: (episodeBody) => {
        if (!Boolean(episodeBody.id)) return db.data.history;
        const data = db.data;
        const { id, time = null, total = null, finished = false, info = null } = episodeBody;
        const watchedInfo = { time, finished, total, timestamp: date() };
        data.history.watched[id] = { ...watchedInfo };
        data.history.latest = latestStackHelper.handle({ ...episodeBody }, MAX_LATEST_EPISODES, data.history.latest);
        db.save(data);

        return db.data.history;
    },
    del: () => {
        const data = db.data.history;
        data.history = { ...emptyHistory };
        db.save(data);
    }
};