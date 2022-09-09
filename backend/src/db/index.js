const fs = require('fs');
const path = require('path');
const { TEE_FOLDER_DB_NAME } = require('../config');

let db = null;

class Db {
    constructor(filePath) {
        this.filePath = filePath;
        this.data = {};
        this.dirty = true;
        if (fs.existsSync(this.filePath)) {
            this.data = JSON.parse(fs.readFileSync(this.filePath));
        }
    }

    save(data) {
        this.data = {
            ...this.data,
            ...data
        };
        this.dirty = true;
    }

    /**
     * Writes changes in-memory 
     * @param {boolean} force - if true will force writing 
     * */
    write(force = false) {
        if (this.dirty || force) {
            fs.writeFileSync(this.filePath, JSON.stringify(this.data));
            this.dirty = false;
            return true;
        }

        return false;
    }

    delete() {
        if (fs.existsSync(this.filePath)) {
            fs.rmSync(this.filePath);
            this.data = {};
            this.dirty = false;
        }
    }
}

const init = filePath => {
    db = new Db(path.join(filePath, TEE_FOLDER_DB_NAME));
};

module.exports = {
    /** @return {Db} */
    getDb(filePath = null) {
        if (!Boolean(db) && !Boolean(filePath)) throw Error(`Cannot init db without filepath, passed ${filePath}`);

        if (!Boolean(db)) {
            init(filePath);
        }
        return db;
    }
};