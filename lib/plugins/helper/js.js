'use strict';

const { urlFormat, createTag } = require('../../uitls');

module.exports = function (paths) {
    if (!paths) return;
    if (typeof paths === 'string' || paths instanceof String) {
        paths = [paths];
    }
    if (Array.isArray(paths)) {
        return paths.map(path => {
            if (!path.endsWith('.js')) path += '.js';
            let { url, root } = this.config.site;
            return createTag('script', {
                src: urlFormat(path, root, url)
            });
        }).join('\n');
    } else {
        return createTag('script', paths);
    }
};