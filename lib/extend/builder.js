'use strict';

// 构建器 
class Builder {
    constructor() {
        this.store = []
    }

    register ({ pattern, process }) {
        this.store.push({
            pattern,
            process
        });
    }
}

module.exports = Builder