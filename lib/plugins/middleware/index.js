'use strict';

module.exports = ctx => {
    const { middleware } = ctx.extend;

    middleware.register(require('./route'));
    middleware.register(require('./static'));
};