'use strict';

const { urlFormat } = require('../../uitls');

module.exports = function (path) {
    if (typeof path === 'string' || path instanceof String) {
        if (!path.endsWith('.css')) {
            path += '.css';
        }
        let { url, root } = this.config.site;
        return `<link rel="stylesheet" href="${urlFormat(path, root, url)}">`;
    }
};