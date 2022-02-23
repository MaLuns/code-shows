'use strict';

// 构建器 
class Builder {
    constructor() {
        this.store = [];
    }

    // 获取构建器列表
    list () {
        return this.store;
    }

    // 注册构建器
    register ({ pattern, build }) {
        this.store.push({
            pattern,
            build
        });
    }
}

module.exports = Builder;