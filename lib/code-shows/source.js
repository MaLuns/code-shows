'use strict';

const Compiler = require('../compiler');

class Source extends Compiler {
    constructor(ctx) {
        super(ctx, ctx.source_dir);
        this.builders = ctx.extend.builder.list();
    }
}

module.exports = Source;

