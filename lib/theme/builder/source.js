'use strict';

const Pattern = require('../../uitls/pattern');
const { join } = require('path');
const { escapeBackslash } = require('../../uitls');

module.exports = {
    pattern: new Pattern(path => {
        if (!path.startsWith('source/')) return false;
        path = path.substring(7);
        return {
            path
        };
    }),
    build (file) {
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
        };
        AssetCache.set(id, data);
        return data;
    }
};