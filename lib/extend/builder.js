'use strict';

// 构建器 
class Builder {
    constructor() {
        this.store = [];
    }

    list () {
        return this.store;
    }

    register ({ pattern, build }) {
        this.store.push({
            pattern,
            build
        });
    }
}

module.exports = Builder;