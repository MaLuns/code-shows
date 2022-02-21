'use strict';

const Promise = require('bluebird');

class Generater {
    constructor() {
        this.id = 0;
        this.store = {};
    }

    list () {
        return this.store;
    }

    get (name) {
        return this.store[name];
    }

    register (name, fn) {
        if (!name) throw new TypeError('name is required');

        this.store[name] = Promise.method(fn);
    }
}

module.exports = Generater;