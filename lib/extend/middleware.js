'use strict';

// 本地服务中间件 
class Middleware {
    constructor() {
        this.store = [];
    }

    // 获取中间件列表
    list () {
        return this.store;
    }

    // 注册中间件 
    register (fun) {
        if (typeof fun !== 'function') throw new TypeError('fun must be a function');
        this.store.push(fun);
    }
}

module.exports = Middleware;