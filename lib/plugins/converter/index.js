'use strict';

module.exports = ctx => {
    const { converter } = ctx.extend;

    converter.register('html', require('./html'));
    converter.register('vue', require('./vue')('vue2'));
    converter.register('vue3', require('./vue')('vue3'));
};