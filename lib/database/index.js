'use strict';

class DataBase {
    constructor(ctx) {
        this.context = ctx;

        this.FileCache = new Map(); // 文件信息缓存
        this.PostCache = new Map(); // 文章信息缓存
        this.AssetCache = new Map(); // 静态文件缓存
    }

    // 加载数据json
    load_db (path) {
        console.log(path);
    }
}

module.exports = DataBase;