'use strict';

module.exports = ctx => {
    const { deployer } = ctx.extend;

    deployer.register('git', require('./git'));
};