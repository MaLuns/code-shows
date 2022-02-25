'use strict';

const fs = require('../../uitls/fs');
const Promise = require('bluebird');

function deleteDatabase (ctx) {
    const { db_path, log } = ctx;

    return fs.exists(db_path).then(exist => {
        if (!exist) return;

        return fs.unlink(db_path).then(() => {
            log.info('已清理缓存信息');
        });
    });
}

function deletePublicDir (ctx) {
    const { dist_dir, log } = ctx;

    return fs.exists(dist_dir).then(exist => {
        if (!exist) return;

        return fs.rmdir(dist_dir).then(() => {
            log.info('已清理目录: %s', ctx.relativePath(dist_dir));
        });
    });
}

function clean () {
    return Promise.all([
        deleteDatabase(this),
        deletePublicDir(this)
    ]);
}

module.exports = clean;