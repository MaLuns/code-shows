'use strict';

// 加载器 
class Loader {
    constructor() {
        this.store = [];
    }

    // 获取加载器列表
    list () {
        return this.store;
    }

    // 注册加载器
    register ({ pattern, load }) {
        this.store.push({
            pattern,
            load
        });
    }
}

module.exports = Loader;