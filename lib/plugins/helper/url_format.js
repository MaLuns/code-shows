'use strict';

const { urlFormat } = require('../../uitls');

module.exports = function (path) {
    let { root } = this.config.site;
    path = urlFormat(path, root);
    return path.replace(/\/index\.html$/, '/');
};