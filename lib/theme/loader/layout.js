'use strict';

const Pattern = require('../../uitls/pattern');

module.exports = {
    pattern: new Pattern(path => {
        if (!path.startsWith('layout/') || path.includes('node_modules')) return false;
        return { path: path.substring(7) };
    }),
    load (file) {
        const { path } = file.params;

        if (file.type === 'delete') {
            file.core.removeView(path);
            return;
        }

        return file.read().then(result => {
            file.core.setView(path, result);
        });
    }
};