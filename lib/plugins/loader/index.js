'use strict';

module.exports = ctx => {
    const { loader } = ctx.extend;

    loader.register(require('./source')(ctx));
};