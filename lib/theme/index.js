'use strict';

const BaseCore = require('../core');
const View = require('./view');
const { extname } = require('path');
const { escapeBackslash } = require('../uitls');

class Theme extends BaseCore {
    constructor(ctx, options) {
        super(ctx, ctx.theme_dir, options);

        this.loaders = [
            require('./loader/layout'),
            require('./loader/source')(ctx)
        ];

        this.Cache = ctx.db.FileCache;
        this.views = {}; // 布局视图

        class _View extends View { }
        _View.prototype._theme = this;
        _View.prototype._render = ctx.render; // 渲染器
        _View.prototype._helper = ctx.extend.helper; // 辅助函数

        this.View = _View;
    }

    // 设置视图
    getView (path) {
        path = escapeBackslash(path);
        const ext = extname(path);
        const name = path.substring(0, path.length - ext.length);
        const views = this.views[name];
        if (!views) return;
        if (ext) return views[ext];
        return views[Object.keys(views)[0]];
    }

    // 设置视图
    setView (path, data) {
        const ext = extname(path);
        const name = path.substring(0, path.length - ext.length);
        this.views[name] = this.views[name] || {};
        const views = this.views[name];
        views[ext] = new this.View(path, data);
    }

    // 移除视图
    removeView (path) {
        const ext = extname(path);
        const name = path.substring(0, path.length - ext.length);
        const views = this.views[name];
        if (!views) return;
        views[ext] = undefined;
    }
}

module.exports = Theme;
