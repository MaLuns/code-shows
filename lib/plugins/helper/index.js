'use strict';

module.exports = ctx => {
    const { helper } = ctx.extend;

    helper.register('render', require('./render')(ctx));
};