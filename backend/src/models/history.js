const fs = require('fs');
const HISTORY_FILE = 'TEE_HISTORY.json';

const emptyHistory = { watched: [] };

let history = {};

module.exports = {
    fetch: catalogFolder => {
        if (fs.existsSync(`${catalogFolder}/${HISTORY_FILE}`)) {
            try {
                history = JSON.parse(fs.readFileSync(`${catalogFolder}/${HISTORY_FILE}`));
            } catch (err) {
                history = { ...emptyHistory };
            }
            return history;
        }
        history = { ...emptyHistory };
        return history;
    },
    log: ({ watched }) => {
        history.watched.push(watched);
        return history;
    },
    persist: catalogFolder => fs.writeFileSync(`${catalogFolder}/${HISTORY_FILE}`, JSON.stringify(history, null, 2)),
    del: catalogFolder => {
        if (fs.existsSync(`${catalogFolder}/${HISTORY_FILE}`)) {
            fs.rmSync(`${catalogFolder}/${HISTORY_FILE}`);
        }
        history = { ...emptyHistory };
    }
};