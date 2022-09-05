const fs = require('fs');
const path = require('path');


const TEE_FOLDER_DB_NAME = `tee_db.json`;

let db = null;

class Db {
    constructor(filePath) {
        this.filePath = filePath;
        this.data = {};
        if (fs.existsSync(this.filePath)) {
            this.data = JSON.parse(fs.readFileSync(this.filePath));
        }
    }

    write() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data));
    }

    delete() {
        if (fs.existsSync(this.filePath)) {
            fs.rmSync(this.filePath);
        }
    }
}

const init = filePath => {
    db = new Db(path.join(filePath, TEE_FOLDER_DB_NAME));
    db.data = { ...emptySchema };
};

const emptySchema = {
    catalog: null,
    seasonsMap: null,
    history: null
};


module.exports = {
    getDb(filePath = null) {
        if (!Boolean(db) && !Boolean(filePath)) throw Error(`Cannot init db without filepath, passed ${filePath}`);

        if (!Boolean(db)) {
            init(filePath);
        }
        return db;
    }
};