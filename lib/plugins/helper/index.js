'use strict';

module.exports = ctx => {
    const { helper } = ctx.extend;

    helper.register('render', require('./render')(ctx));
    helper.register('css', require('./css'));
    helper.register('paginator', require('./paginator'));
    helper.register('url_format', require('./url_format'));
};