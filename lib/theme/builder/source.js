'use strict';

const Pattern = require('../../uitls/pattern');

module.exports = {
    pattern: new Pattern(path => {
        if (!path.startsWith('source/')) return false;

        path = path.substring(7);

        return {
            path
        };
    }),
    process (file) {
        const { path } = file.params;

        if (file.type === 'delete') {
            file.box.removeView(path);
            return;
        }
    }
};