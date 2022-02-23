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
    load_db () {
        exists(this.db_path).then(exist => {
            if (!exist) return;
            let dbJson = this.ctx.render.runSync({ path: this.db_path });
            Object.keys(dbJson).forEach(key => {
                if (this[key]) {
                    dbJson[key].forEach(element => {
                        let { _id, ...data } = element;
                        this[key].set(_id, data);
                    });
                }
            });
            console.log('数据库加载完成');
        }).catch((e) => {
            console.log('数据库加载失败', e);
            unlink(this.db_path);
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