'use strict';

const Promise = require('bluebird');
const { join } = require('path');
const { loadScript } = require('../../uitls');
const { exists, readFolderDir } = require('../../uitls/fs');

// 加载内部插件
const load_in_plugins = (ctx) => {
    require('../../plugins/renderer')(ctx);
    require('../../plugins/loader')(ctx);
    require('../../plugins/generator')(ctx);
    require('../../plugins/helper')(ctx);
    require('../../plugins/deployer')(ctx);
    require('../../plugins/middleware')(ctx);
};

// 加载扩展插件
const load_out_plugins = async (ctx) => {
    const { script_dir, theme_script_dir, log } = ctx;

    return Promise.filter(
        [script_dir, theme_script_dir],
        scriptDir => scriptDir ? exists(scriptDir) : false
    ).map(scriptDir =>
        Promise
            .filter(readFolderDir(scriptDir), name => !name.startsWith('console/'))
            .map(name => {
                const path = join(scriptDir, name);
                return loadScript(path, ctx).then(() => {
                    log.info('Loaded: %s', ctx.relativePath(path));
                }).catch((err) => {
                    log.error('Load failed: %s', ctx.relativePath(path), { err });
                });
            })
    );
};

module.exports = function (ctx) {
    ctx.log.info('Plug-in loading....');
    return Promise.allSettled([
        load_in_plugins(ctx),
        load_out_plugins(ctx),
    ]).then(() => {
        ctx.log.info('Plug-in loading complete.');
    });
};