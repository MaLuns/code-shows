'use strict';

module.exports = ctx => {
    const { converter } = ctx.extend;

    converter.register('html', require('./html'));
    converter.register('vue', require('./html'));
};