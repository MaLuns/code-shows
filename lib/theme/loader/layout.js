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
            file.compiler.removeView(path);
            return;
        }

        return file.read().then(result => {
            file.compiler.setView(path, result);
        });
    }
};