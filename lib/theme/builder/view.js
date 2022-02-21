'use strict';

const Pattern = require('../../uitls/pattern');

module.exports = {
    pattern: new Pattern('layout/*path'),
    process (file) {
        const { path } = file.params;
        
        if (file.type === 'delete') {
            file.box.removeView(path);
            return;
        }
    }
};