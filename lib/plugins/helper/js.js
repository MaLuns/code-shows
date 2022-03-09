'use strict';

const { urlFormat, createTag } = require('../../uitls');

module.exports = function (paths) {
    if (!paths) return;
    if (typeof paths === 'string' || paths instanceof String) {
        paths = [paths];
    }
    let { url, root } = this.config.site;
    if (Array.isArray(paths)) {
        return paths.map(path => {
            if (!path.endsWith('.js')) path += '.js';
            return createTag('script', {
                src: urlFormat(path, root, url)
            });
        }).join('\n');
    } else {
        if (paths.src) {
            return createTag('script', {
                ...paths,
                src: urlFormat(paths.src, root, url)
            });
        }
        return '';
    }
};