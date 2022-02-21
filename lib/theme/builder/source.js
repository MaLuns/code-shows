'use strict';

const Pattern = require('../../uitls/pattern');

module.exports = {
    pattern: new Pattern(path => {
        console.log(path);
        if (!path.startsWith('source/')) return false;
        path = path.substring(7);
        return {
            path
        };
    }),
    build (file) {
        const { path } = file.params;

        if (file.type === 'delete') {
            file.compiler.removeView(path);
            return;
        }
    }
};