'use strict';

class Convert {
    constructor(ctx) {
        this.context = ctx;
        this.converter = ctx.extend.converter;
    }

    get (name) {
        return this.converter.get(name);
    }

    isConvert (name) {
        return this.converter.isExtend(name);
    }
}

module.exports = Convert;