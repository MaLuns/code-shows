'use strict';

const DataCache = require('./dataCache');

class DataBase {
    constructor() {
        this.FileCache = new DataCache(); // 文件信息缓存
        this.PostCache = new DataCache(); // 代码片段信息
        this.PostAssetCache = new DataCache(); // 代码片段静态文件
        this.AssetCache = new DataCache(); // 全局静态文件

        this.ThemeCache = new DataCache(); // 主题文件缓存
        this.ThemeLayoutCache = new DataCache();//
    }

    // 加载数据json
    load_db (path) {
        console.log(path);
    }
}

module.exports = DataBase;