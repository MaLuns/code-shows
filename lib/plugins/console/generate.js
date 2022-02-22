'use strict';

const Promise = require('bluebird');
const prettyHrtime = require('pretty-hrtime');
const { PassThrough } = require('stream');
const { join } = require('path');
const { stat, mkdir, exists } = require('../../uitls/fs');

class Generater {
    constructor(ctx) {
        this.context = ctx;
        this.start = process.hrtime();

        this.generatingFiles = new Set();
    }

    generateFile (path) {
        const dist_dir = this.context.dist_dir;
        const { generatingFiles } = this;
        const { route } = this.context;

        if (generatingFiles.has(path)) return Promise.resolve();

        generatingFiles.add(path);

        const dest = join(dist_dir, path);
        const promise = exists(dest).then(exist => {
            if (!exist) return this.writeFile(path, true);
            // 路由有更新
            if (route.isModified(path)) return this.writeFile(path);
        });

        return promise.finally(() => {
            generatingFiles.delete(path);
        });
    }

    writeFile (path, force) {
        const { route, log } = this.context;
        const dataStream = route.get(path).pipe(new PassThrough());

        const buffers = [];

        const finishedPromise = new Promise((resolve, reject) => {
            dataStream.once('error', reject);
            dataStream.once('end', resolve);
        });

        dataStream.on('data', chunk => {
            buffers.push(chunk);
        });

        return finishedPromise.then(() => {
            console.log(buffers);
        });
    }

    firstGenerate () {
        const { dist_dir, route, log } = this.context;

        let interval = prettyHrtime(process.hrtime(this.start));
        log.info(`Files loaded in ${interval}`);

        return stat(dist_dir).then(stats => {
            if (!stats.isDirectory()) {
                throw new Error(`${dist_dir} is not a directory`);
            }
        }).catch(err => {
            if (err.cause && err.cause.code === 'ENOENT') {
                return mkdir(dist_dir);
            }
            throw err;
        }).then(() => {
            const task = (fn, path) => () => fn.call(this, path);
            const doTask = fn => fn();

            const routeList = route.list();
            const tasks = routeList.map(path => task(this.generateFile, path));

            return Promise.all(Promise.map(tasks, doTask));
        }).then(result => {
            interval = prettyHrtime(process.hrtime(this.start));
            log.info(`${result.length} files generated in ${interval}`);
        });
    }
}



module.exports = function () {
    const generater = new Generater(this);
    return this.load().then(() => generater.firstGenerate()).then(() => {

    });
};