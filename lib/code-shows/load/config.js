'use strict';

const _ = require('lodash');
const { existsSync } = require('../../uitls/fs');
const { sep, resolve } = require('path');
const Source = require('../../source');

module.exports = (ctx) => {
    if (existsSync(ctx.config_path)) {
        let config = _.merge({}, ctx.config, ctx.render.runSync({ path: ctx.config_path })); // 
        ctx.config = config;

        ctx.dist_dir = resolve(ctx.base_dir, config.dist_dir) + sep;
        ctx.source_dir = resolve(ctx.base_dir, config.source_dir) + sep;
        ctx.source = new Source(ctx);
    }
};