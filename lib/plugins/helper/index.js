'use strict';

module.exports = ctx => {
    const { helper } = ctx.extend;

    helper.register('render', require('./render')(ctx));
    helper.register('css', require('./css'));
    helper.register('js', require('./js'));
    helper.register('tag', require('./tag'));
    helper.register('paginator', require('./paginator'));
    helper.register('url_format', require('./url_format'));
    helper.register('full_url_for', require('./full_url_for'));
    helper.register('variable', require('./variable'));
};