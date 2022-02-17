'use strict';

module.exports = ctx => {
    const { builder } = ctx.extend;

    builder.register(require('./source')(ctx));
};