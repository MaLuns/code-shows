'use strict';

const Compiler = require('../compiler');

class Theme extends Compiler {
    constructor(ctx, options) {
        super(ctx, ctx.theme_dir, options);

        this.builders = [];
    }

}

module.exports = Theme;
