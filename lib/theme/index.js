'use strict';

const Compiler = require('../compiler');
const View = require('./view');
const { extname } = require('path');
const { escapeBackslash } = require('../uitls');

class Theme extends Compiler {
    constructor(ctx, options) {
        super(ctx, ctx.theme_dir, options);

        this.builders = [
            require('./builder/layout'),
            require('./builder/source')
        ];

        this.Cache = ctx.db.FileCache;
        this.views = {};

        class _View extends View { }

        _View.prototype._theme = this;
        _View.prototype._render = ctx.render;

        this.View = _View;
    }

    getView (path) {
        path = escapeBackslash(path);

        const ext = extname(path);
        const name = path.substring(0, path.length - ext.length);
        const views = this.views[name];

        if (!views) return;
        if (ext) {
            return views[ext];
        }

        return views[Object.keys(views)[0]];
    }

    setView (path, data) {
        const ext = extname(path);
        const name = path.substring(0, path.length - ext.length);
        this.views[name] = this.views[name] || {};
        const views = this.views[name];

        views[ext] = new this.View(path, data);
    }

    removeView (path) {
        const ext = extname(path);
        const name = path.substring(0, path.length - ext.length);
        const views = this.views[name];

        if (!views) return;

        views[ext] = undefined;
    }
}

module.exports = Theme;
