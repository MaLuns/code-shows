'use strict';

// 构建器 
class Loader {
    constructor() {
        this.store = [];
    }

    // 获取构建器列表
    list () {
        return this.store;
    }

    // 注册构建器
    register ({ pattern, load }) {
        this.store.push({
            pattern,
            load
        });
    }
}

module.exports = Loader;