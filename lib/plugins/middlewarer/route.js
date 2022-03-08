'use strict';

const mime = require('mime');
const { extname } = require('path');

module.exports = function (app) {
    let { config, route } = this;

    const getRouteData = (url, res) => {
        url = route.format(decodeURIComponent(url));
        if (route.get(url)) {
            if (url.endsWith('.html')) res.setHeader('Content-Type', 'text/html');
            return route.get(url);
        } else if (route.get(url + '.html')) {
            res.setHeader('Content-Type', 'text/html');
            return route.get(url + '.html');
        } else if (route.get(url + '/index.html')) {
            res.setHeader('Content-Type', 'text/html');
            return route.get(url + '/index.html');
        } else {
            return null;
        }
    };

    app.use(config.site.root, (req, res, next) => {
        const { method, url } = req;

        if (['GET', 'HEAD'].includes(method)) {
            const ext = extname(url);
            if (!res.hasHeader('Content-Type')) {
                res.setHeader('Content-Type', ext ? mime.getType(ext) : 'application/octet-stream');
            }
            let data = getRouteData(url, res);
            if (data) {
                data.pipe(res).on('error', next);
                return;
            } else {
                next();
            }
        } else {
            next();
        }
    });
};