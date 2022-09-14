const TEE_FOLDER_DB_NAME = `tee_db.json`;
const MAX_LATEST_EPISODES = 4;
const DEFAULT_PORT = 3001;

// every 5 Minutes
const DB_PERSIST_INTERVAL = 5 * 60 * 1000;


module.exports = {
    TEE_FOLDER_DB_NAME,
    MAX_LATEST_EPISODES,
    DEFAULT_PORT,
    DB_PERSIST_INTERVAL,
};