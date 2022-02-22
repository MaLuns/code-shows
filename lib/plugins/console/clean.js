'use strict';

const fs = require('../../uitls/fs');
const Promise = require('bluebird');

function deleteDatabase (ctx) {
    const dbPath = ctx.db_path;

    return fs.exists(dbPath).then(exist => {
        if (!exist) return;

        return fs.unlink(dbPath).then(() => {
            ctx.log.info('Deleted database.');
        });
    });
}

function deletePublicDir (ctx) {
    const dist_dir = ctx.dist_dir;

    return fs.exists(dist_dir).then(exist => {
        if (!exist) return;

        return fs.rmdir(dist_dir).then(() => {
            ctx.log.info('Deleted public folder.');
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