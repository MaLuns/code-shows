'use strict';

const Promise = require('bluebird');

class BaseExtend {
    constructor() {
        this.store = {};
    }

    // 获取列表
    list () {
        return this.store;
    }

    // 获取扩展函数
    get (name) {
        return this.store[name];
    }

    // 注册扩展函数
    register (name, fn) {
        if (!name) throw new TypeError('name is required');
        this.store[name] = Promise.method(fn);
    }
}

module.exports = BaseExtend;