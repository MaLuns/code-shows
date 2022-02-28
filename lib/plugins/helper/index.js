'use strict';

module.exports = ctx => {
    const { helper } = ctx.extend;

    helper.register('render', require('./render')(ctx));
    helper.register('css', require('./css'));
    helper.register('paginator', require('./paginator'));
};