'use strict';

const Compiler = require('../compiler');

class Source extends Compiler {
    constructor(ctx, base) {
        super(ctx, base);

        this.builders = ctx.extend.builder.list();
    }
}

module.exports = Source;

