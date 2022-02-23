'use strict';

const Pattern = require('../../uitls/pattern');

module.exports = {
    pattern: new Pattern('layout/*path'),
    build (file) {
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