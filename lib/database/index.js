'use strict';

const { writeFile, exists, unlink } = require('../uitls/fs');
const DataCache = require('./dataCache');

class DataBase {
    constructor(ctx) {
        this.ctx = ctx;
        this.db_path = ctx.db_path;

        this.FileCache = new DataCache(); // 文件信息缓存
        this.PostCache = new DataCache(); // 代码片段信息
        this.PostAssetCache = new DataCache(); // 代码片段静态文件
        this.AssetCache = new DataCache(); // 全局静态文件
    }

    // 加载数据json
    async load_db () {
        const { ctx, db_path } = this;
        const { log, render } = ctx;

        return exists(db_path).then(exist => {
            if (!exist) return;
            let dbJson = render.runSync({ path: db_path });
            Object.keys(dbJson).forEach(key => {
                if (this[key]) {
                    dbJson[key].forEach(element => {
                        let { _id, ...data } = element;
                        this[key].set(_id, data);
                    });
                }
            });
            log.info('Loaded cache db: %s', ctx.relativePath(db_path));
        }).catch((e) => {
            log.error('Loaded: %s', e);
            unlink(db_path);
        });
    }

    // 获取所有代码片段
    site () {
        return {
            codes: this.PostCache.toArray()
        };
    }

    // 
    stringify () {
        const obj = {};
        ['FileCache', 'PostCache', 'PostAssetCache', 'AssetCache'].forEach(key => {
            obj[key] = this[key].toArray();
        });
        return JSON.stringify(obj);
    }

    cache () {
        writeFile(this.db_path, this.stringify());
    }
}

module.exports = DataBase;