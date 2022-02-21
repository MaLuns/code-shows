'use strict';

module.exports = ctx => {
    const { generator } = ctx.extend;

    generator.register('page', require('./page'));
};