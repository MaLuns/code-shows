'use strict';

const { urlFormat, createTag } = require('../../uitls');

module.exports = function (paths) {
    if (!paths) return;
    if (typeof paths === 'string' || paths instanceof String) {
        paths = [paths];
    }
    let { root } = this.config.site;
    if (Array.isArray(paths)) {
        return paths.map(path => {
            if (!path.endsWith('.css')) path += '.css';

            return createTag('link', {
                rel: 'stylesheet',
                href: urlFormat(path, root)
            });
        }).join('\n');
    } else {
        if (paths.href) {
            return createTag('link', {
                ...paths,
                href: urlFormat(paths.href, root)

            });
        }
        return '';
    }
};