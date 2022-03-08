'use strict';

module.exports = ctx => {
    const { middlewarer } = ctx.extend;

    middlewarer.register(require('./route'));
    middlewarer.register(require('./static'));
};