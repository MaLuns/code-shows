'use strict';

const connect = require('connect');
const http = require('http');

function server (port, ctx) {
    const { route, config } = ctx;
    const app = connect();

    app.use(config.site.root, (req, res, next) => {
        const { method, url } = req;
        if (['GET', 'HEAD'].includes(method)) {
            const requestUrl = route.format(decodeURIComponent(url));
            let data = route.get(requestUrl);
            
            if (data) {
                data.pipe(res).on('error', next);
                return;
            } else if (route.get(requestUrl + '.html')) {
                res.setHeader('Content-Type', 'text/html');
                data = route.get(requestUrl + '.html');
                data.pipe(res).on('error', next);
                return;
            } else if (route.get(requestUrl + '/index.html')) {
                res.setHeader('Content-Type', 'text/html');
                data = route.get(requestUrl + '/index.html');
                data.pipe(res).on('error', next);
                return;
            }
        } else {
            next();
        }
        res.end();
    });

    let server = http.createServer(app);
    server.listen(port);
}


module.exports = function (port) {
    return this.watch().then(() => {
        server(port, this);
    });
};