'use strict';

const BaseExtend = require('./base');

// 辅助函数
class Helper extends BaseExtend {
    // 注册扩展函数
    register (name, fn) {
        if (!name) throw new TypeError('name is required');
        this.store[name] = fn;
    }
}

module.exports = Helper;