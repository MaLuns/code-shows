'use strict';

const _ = require('lodash');
const { existsSync } = require('../../uitls/fs');
const { sep, resolve } = require('path');
const Source = require('../../source');
const Theme = require('../../theme');

module.exports = (ctx) => {
    if (existsSync(ctx.config_path)) {
        let config = ctx.render.runSync({ path: ctx.config_path });
        ctx.config = _.merge({}, ctx.config, typeof config === 'string' ? JSON.parse(config) : config);

        const { dir, theme, skip_console } = ctx.config;

        ctx.skip_console = ctx.skip_console.concat(skip_console)
        ctx.asset_dir = resolve(ctx.base_dir, dir.asset_dir) + sep; // 资源目录
        ctx.source_dir = resolve(ctx.base_dir, dir.source_dir) + sep; // 源码目录
        ctx.script_dir = resolve(ctx.base_dir, dir.script_dir) + sep;// 插件脚本 
        ctx.dist_dir = resolve(ctx.base_dir, dir.dist_dir) + sep; // 生成静态文件目录
        ctx.theme_dir = resolve(ctx.base_dir, dir.theme_dir) + sep; // 布局目录

        if (config.theme.use) {
            const themeDir = join(ctx.plugin_dir, 'code-shows-theme-' + use) + sep;
            if (existsSync(themeDir)) {
                ctx.theme_dir = themeDir;
            }
        }

        ctx.theme_script_dir = resolve(ctx.theme_dir, 'scripts') + sep;
        ctx.source = new Source(ctx);
        ctx.theme = new Theme(ctx);
    }
};