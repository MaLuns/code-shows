'use strict';

const Compiler = require('../compiler');
const { extname } = require('path');

class Theme extends Compiler {
    constructor(ctx, options) {
        super(ctx, ctx.theme_dir, options);

        this.builders = [
            require('./builder/view'),
            require('./builder/source')
        ];

        this.Cache = ctx.db.ThemeCache;
        this.views = {};
    }

    getView (path) {
        path = path.replace(/\\/g, '/');

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
