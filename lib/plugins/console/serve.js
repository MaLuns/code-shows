'use strict';

const connect = require('connect');
const http = require('http');
const os = require('os');
const chalk = require('chalk');

function server (port, ctx) {
    const { route, config } = ctx;
    const app = connect();

    const getRouteData = (url) => {
        url = route.format(decodeURIComponent(url));
        if (route.get(url)) {
            return route.get(url);
        } else if (route.get(url + '.html')) {
            return route.get(url + '.html');
        } else if (route.get(url + '/index.html')) {
            return route.get(url + '/index.html');
        } else {
            return null;
        }
    };

    app.use(config.site.root, (req, res, next) => {
        const { method, url } = req;
        if (['GET', 'HEAD'].includes(method)) {
            let data = getRouteData(url);
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

    const server = http.createServer(app);
    server.listen(port, () => {
        console.log(chalk.black(chalk.bgGreenBright(' DONE ')), chalk.greenBright('Compiled successfully'));
        console.log('\n\n  Serve running at:');
        console.log('  - Local:', chalk.blueBright(new URL(`http://localhost:${port}${config.site.root}`).toString()));
        console.log('  - Network:', chalk.blueBright(new URL(`http://${getIpv4()}:${port}${config.site.root}`).toString()), '\n\n');
    });
}

function getIpv4 () {
    let net = os.networkInterfaces();
    let ipv4;
    for (const key in net) {
        net[key].forEach(element => {
            if (element.address !== '127.0.0.1' && element.family.toLocaleLowerCase() === 'ipv4') ipv4 = element.address;
        });
    }
    return ipv4;
}

module.exports = function (port) {
    return this.watch().then(() => {
        server(port, this);
    });
};