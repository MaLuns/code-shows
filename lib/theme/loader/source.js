'use strict';

const Pattern = require('../../uitls/pattern');
const { join } = require('path');
const { escapeBackslash } = require('../../uitls');

module.exports = ctx => ({
    pattern: new Pattern(path => {
        if (!path.startsWith('source/') || path.includes('node_modules')) return false;
        path = path.substring(7);
        const result = { path };
        if (path.startsWith('styles/')) {
            result.renderable = ctx.render.isRenderable(path);
        }
        return result;
    }),
    load (file) {
        const { db } = this;
        const { path } = file.params;
        const AssetCache = db.AssetCache;
        const id = escapeBackslash(file.source.substring(this.base_dir.length));

        if (file.type === 'delete') {
            return AssetCache.delete(id);
        }
        const data = {
            path: join('asset', path),
            source: file.source,
            modified: file.type !== 'skip',
            renderable: file.params.renderable
        };
        AssetCache.set(id, data);
        return data;
    }
});