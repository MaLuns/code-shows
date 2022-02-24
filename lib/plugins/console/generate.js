'use strict';

const Promise = require('bluebird');
const prettyHrtime = require('pretty-hrtime');
const { PassThrough } = require('stream');
const { join } = require('path');
const { stat, mkdir, exists, writeFile, unlink } = require('../../uitls/fs');
const { createSha1Hash } = require('../../uitls');

class Generater {
    constructor(ctx) {
        this.context = ctx;
        this.start = process.hrtime();

        this.generatingFiles = new Set();
    }

    // 根据路由生成文件
    generateFile (path) {
        const dist_dir = this.context.dist_dir;
        const { generatingFiles } = this;
        const { route } = this.context;

        if (generatingFiles.has(path)) return Promise.resolve();

        generatingFiles.add(path);

        const dest = join(dist_dir, path);
        const promise = exists(dest).then(exist => {
            // 如果文件不存在 或 路由有更新
            if (!exist || route.isModified(path))
                return this.writeFile(path);
        });

        return promise.finally(() => {
            generatingFiles.delete(path);
        });
    }

    // 写入文件
    writeFile (path) {
        const { route, log, dist_dir, db } = this.context;
        const dataStream = route.get(path).pipe(new PassThrough());
        const buffers = [];
        const hasher = createSha1Hash();

        const finishedPromise = new Promise((resolve, reject) => {
            dataStream.once('error', reject);
            dataStream.once('end', resolve);
        });

        dataStream.on('data', chunk => {
            buffers.push(chunk);
            hasher.update(chunk);
        });

        return finishedPromise.then(() => {
            const dest = join(dist_dir, path);
            const hash = hasher.digest('hex');
            const cacheId = `dist/${path}`;
            const file = db.FileCache.get(cacheId);

            if (file && hash === file.hash) {
                log.debug(`Generated cache: ${cacheId}`);
                return;
            }

            // 缓存文件生成信息
            db.FileCache.set(cacheId, { hash });

            return writeFile(dest, Buffer.concat(buffers)).then(() => {
                log.info(`Generated: ${cacheId}`);
                return true;
            });
        });
    }

    // 删除文件
    deleteFile (path) {
        const { log, dist_dir } = this.context;
        const dest = join(dist_dir, path);
        return unlink(dest).then(() => {
            log.info(`Deleted: ${dest}`);
        }, err => {
            if (err && err.code === 'ENOENT') return;
            throw err;
        });
    }

    // 首次生成文件
    firstGenerate () {
        const { dist_dir, route, log, db } = this.context;

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

            const distFiles = db.FileCache.toArray()
                .filter(item => item._id.startsWith('dist/'))
                .map(item => item._id.substring(5));

            const tasks = distFiles.filter(path => !routeList.includes(path))
                // 删除不在路由里文件
                .map(path => task(this.deleteFile, path))
                // 生成路由文件
                .concat(routeList.map(path => task(this.generateFile, path)));

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
        this.db.cache();
    });
};