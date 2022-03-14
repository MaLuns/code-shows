'use strict';

const BaseCore = require('../core');

class Source extends BaseCore {
    constructor(ctx) {
        super(ctx, ctx.source_dir);
        this.loaders = ctx.extend.loader.list();
        this.Cache = ctx.db.FileCache;// 缓存文件信息
    }
}

module.exports = Source;
