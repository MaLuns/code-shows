'use strict';

class DataBase {
    constructor() {
        this.model = new Map();
    }

    register (name) {
        this.model.set(name, []);
    }
}

module.exports = DataBase;