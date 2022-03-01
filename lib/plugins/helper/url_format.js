'use strict';

const { urlFormat } = require('../../uitls');

module.exports = function (path) {
    let { url, root } = this.config.site;
    return urlFormat(path, root, url);
};