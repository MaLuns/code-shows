'use strict';

const { urlFormat } = require('../../uitls');

module.exports = function (path) {
    let { url, root } = this.config.site;
    path = urlFormat(path, root, url);
    return path.replace(/\/index\.html$/, '/');
};