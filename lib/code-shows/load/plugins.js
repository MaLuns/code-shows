'use strict';

const Promise = require('bluebird');
const { join } = require('path');
const { loadScript } = require('../../uitls');
const { exists, readdirFilePaths } = require('../../uitls/fs');

// 加载内部插件
const load_in_plugins = (ctx) => {
    require('../../plugins/renderer')(ctx);
    require('../../plugins/builder')(ctx);
    require('../../plugins/generator')(ctx);
    require('../../plugins/helper')(ctx);
};

// 加载扩展插件
const load_out_plugins = async (ctx) => {
    const { script_dir, theme_script_dir, log } = ctx;

    return Promise.filter(
        [script_dir, theme_script_dir],
        scriptDir => scriptDir ? exists(scriptDir) : false
    ).map(scriptDir =>
        Promise
            .filter(readdirFilePaths(scriptDir), name => !name.startsWith('console/'))
            .map(name => {
                const path = join(scriptDir, name);
                return loadScript(path, ctx).then(() => {
                    log.info('已加载: %s', ctx.relativePath(path));
                }).catch((err) => {
                    log.error('加载失败: %s', ctx.relativePath(path), { err });
                });
            })
    );
};

module.exports = function (ctx) {
    ctx.log.info('插件加载中....');
    return Promise.allSettled([
        load_in_plugins(ctx),
        load_out_plugins(ctx),
    ]).then(() => {
        ctx.log.info('插件加载完成');
    });
};