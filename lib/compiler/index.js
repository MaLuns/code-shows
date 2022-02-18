const Promise = require('bluebird');
const File = require('../uitls/file');
const { EventEmitter } = require('events');
const { join, sep } = require('path');
const { getFileHash, escapeBackslash } = require('../uitls');
const { stat, readdirSync } = require('../uitls/fs');

const readDirFilePaths = (path, prefix = '') => {
    const files = readdirSync(path, { withFileTypes: true });
    const results = [];

    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const prefixdPath = `${prefix}${file.name}`;
        if (file.isDirectory()) {
            results.push(...readDirFilePaths(join(path, file.name), `${prefixdPath}/`));
        }
        if (file.isFile()) {
            results.push(prefixdPath);
        }
    }
    return results;
};

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
    }

    // 扩展File类型
    fileExtension () {
        const ctx = this.context;
        class _File extends File {
            render (options) {
                return ctx.render.render({
                    path: this.source
                }, options);
            }

            renderSync (options) {
                return ctx.render.renderSync({
                    path: this.source
                }, options);
            }
        }

        _File.prototype.box = this;

        return _File;
    }

    // 读取文件目录
    async _readDir (base, prefix = '') {
        const paths = readDirFilePaths(base, prefix);
        return Promise
            .map(paths, path => this._checkFileStatus(path))
            .map(file => this._buildFile(file.type, file.path));
    }

    // 校验文件状态
    _checkFileStatus (path) {
        const src = join(this.base, path);
        const id = escapeBackslash(src.substring(this.context.base_dir.length));

        const cache = this.Cache.get(id);
        if (!cache) {
            return Promise.all([
                getFileHash(src),
                stat(src)
            ]).spread((hash, stats) => {
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

    // 构建文件
    _buildFile (type, path) {
        if (this._buildingFiles[path]) {
            return Promise.resolve();
        }

        this.emit('buildBefore', { type, path });

        const { base, File, context: ctx } = this;
        this._buildingFiles[path] = true; // 标记文件处理中
        const source = join(base, path); // 文件绝对路径地址

        return Promise.reduce(this.builders, (count, build) => {
            const params = build.pattern.match(path);  // 匹配文件规则
            if (!params) return count;

            // 处理文件
            const file = new File({ source, path, params, type });
            return Reflect.apply(Promise.method(build.process), ctx, [file]).thenReturn(count + 1);
        }, 0).then(count => {
            if (count) ctx.log.debug(`Processed: ${source}`);
            this.emit('processAfter', { type, path });
        }).catch((err) => {
            ctx.log.error(`Process failed: ${source}`);
            ctx.log.info(err);
        }).finally(() => {
            this._buildingFiles[path] = false;
        }).thenReturn(path);
    }

    // 构建入口
    build (callback) {
        const { base } = this;
        return stat(base).then(async stats => {
            if (!stats.isDirectory()) return;
            const files = await this._readDir(base);

            /* Promise.all(files).then(res => {
                console.log(1, res);
            }); */
            console.log(files);

        }).asCallback(callback);
    }
}

module.exports = Compiler;