'use strict';

const Promise = require('bluebird');
const File = require('../uitls/file');
const { EventEmitter } = require('events');
const { join, sep } = require('path');
const { getFileHash, escapeBackslash } = require('../uitls');
const { stat, readFolderDir, existsSync, watch } = require('../uitls/fs');


class Compiler extends EventEmitter {
    constructor(ctx, base) {
        super();
        this.base = base;
        if (!base.endsWith(sep)) {
            base += sep;
        }

        this.context = ctx;
        this.File = this.fileExtension();
        this.builders = [];
        this._buildingFiles = {};
        this.Cache = new Map();// 缓存文件信息
        this.watcher = null;
    }

    /**
     * 扩展File类型
     * @returns 
     */
    fileExtension () {
        const ctx = this.context;
        class _File extends File {
            render (options) {
                return ctx.render.render({ path: this.source }, options);
            }

            renderSync (options) {
                return ctx.render.renderSync({ path: this.source }, options);
            }
        }

        _File.prototype.compiler = this;
        return _File;
    }

    /**
     * 读取文件夹
     * @param {*} base 文件夹目录
     * @param {*} prefix 
     * @returns 
     */
    async _readDir (base, prefix = '') {
        const paths = readFolderDir(base, prefix);
        return Promise
            .map(paths, path => this._checkFileStatus(path))
            .map(file => this._buildFile(file.type, file.path));
    }

    /**
     * 校验文件状态
     * @param {*} path 文件的相对路径
     * @returns 
     */
    _checkFileStatus (path) {
        const src = join(this.base, path);
        const id = escapeBackslash(src.substring(this.context.base_dir.length));
        const cache = this.Cache.get(id);

        if (!cache) {
            return Promise.all([getFileHash(src), stat(src)]).spread((hash, stats) => {
                this.Cache.set(id, {
                    hash,
                    modified: stats.mtime.getTime()
                });
            }).thenReturn({
                path,
                type: File.TYPE_CREATE
            });
        }

        let mtime;
        return stat(src).then(stats => {
            mtime = stats.mtime.getTime();
            // 时间相同, 跳过文件
            if (cache.modified === mtime) {
                return {
                    path,
                    type: File.TYPE_SKIP
                };
            }

            // 返回文件Hash
            return getFileHash(src);
        }).then(result => {
            // 未改动文件
            if (typeof result === 'object') return result;
            const hash = result;

            // 文件hash值一样, 跳过文件
            if (cache.hash === hash) {
                return {
                    path,
                    type: File.TYPE_SKIP
                };
            }

            // 更新文件缓存信息
            cache.hash = hash;
            cache.modified = mtime;

            return {
                path,
                type: File.TYPE_UPDATE
            };
        });
    }

    /**
     * 构建文件
     * @param {*} type 文件类型 File.TYPE
     * @param {*} path 文件的相对路径
     * @returns 
     */
    _buildFile (type, path) {
        if (this._buildingFiles[path]) {
            return Promise.resolve();
        }

        this.emit('buildBefore', { type, path });

        const { base, File, context: ctx } = this;
        const { log } = ctx;
        this._buildingFiles[path] = true; // 标记文件处理中
        const source = join(base, path); // 文件绝对路径地址

        return Promise.reduce(this.builders, (count, build) => {
            const params = build.pattern.match(path);  // 判断当前 builder 能否处理 当前文件
            if (!params) return count;

            const file = new File({ source, path, params, type });  // 处理文件
            return Reflect.apply(Promise.method(build.build), ctx, [file]).thenReturn(count + 1); // 调用 build
        }, 0).then(count => {
            if (count) {
                log.info(`Load: ${path}`);
            }

            this.emit('buildAfter', { type, path });
        }).catch((err) => {
            log.error('Load failed: %s', source, { err });
        }).finally(() => {
            this._buildingFiles[path] = false;
        }).thenReturn(path);
    }

    /**
     * 构建入口
     * @returns 
     */
    async build () {
        const { base, context: ctx } = this;
        const { log } = ctx;
        if (!existsSync(base)) {
            log.debug(`${base} not empty. Please check the file directory`);
            return Promise.reject(new Error('source_dir not empty.'));
        }

        log.info('Load folder: %s', ctx.relativePath(base));

        return stat(base).then(async stats => {
            if (!stats.isDirectory()) return;
            const files = await this._readDir(base);
            return files;
        });
    }

    /**
     * 添加文件监听
     */
    watch () {
        if (this.isWatching()) return Promise.reject(new Error('Watcher has already started.'));

        const { base } = this;
        const getPath = (path) => escapeBackslash(path.substring(base.length));

        return this.build().then(() => watch(this.base, {})).then(watcher => {
            this.watcher = watcher;

            watcher.on('add', path => {
                this._buildFile(File.TYPE_CREATE, getPath(path));
            });

            watcher.on('change', path => {
                this._buildFile(File.TYPE_UPDATE, getPath(path));
            });

            watcher.on('unlink', path => {
                this._buildFile(File.TYPE_DELETE, getPath(path));
            });

            watcher.on('addDir', path => {
                let prefix = getPath(path);
                if (prefix) prefix += '/';

                this._readDir(path, prefix);
            });
        });
    }

    /**
     * 取消文件监听
     */
    unwatch () {
        if (!this.isWatching()) return;

        this.watcher.close();
        this.watcher = null;
    }

    isWatching () {
        return Boolean(this.watcher);
    }
}

module.exports = Compiler;