'use strict';


const Promise = require('bluebird');
const { join } = require('path');
const { loadScript } = require('../../uitls');
const { exists, readFolderDir } = require('../../uitls/fs');

// 注册内置命令
const load_in_console = (ctx) => {
    require('../../plugins/console')(ctx);
};

// 注册扩展命令
const load_out_console = (ctx) => {
    const { script_dir, theme_script_dir } = ctx;

    return Promise.filter(
        [script_dir, theme_script_dir],
        scriptDir => scriptDir ? exists(scriptDir) : false
    ).map(scriptDir => Promise
        .filter(readFolderDir(scriptDir), name => name.startsWith('console/'))
        .map(name => loadScript(join(scriptDir, name), ctx))
    );
};

module.exports = (ctx) => {
    return Promise.allSettled([
        load_in_console(ctx),
        load_out_console(ctx)
    ]);
};