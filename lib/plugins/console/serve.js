'use strict';

const Promise = require('bluebird');
const connect = require('connect');
const http = require('http');
const net = require('net');
const chalk = require('chalk');
const { getIpv4 } = require('../../uitls');

/**
 * 端口检测
 * @param {*} port 
 * @returns 
 */
const probe = async (port) => {
    if (port > 65535 || port < 1) {
        return Promise.reject(new RangeError(`Port number ${port} is invalid. Try a number between 1 and 65535.`));
    }

    const server = net.createServer();
    await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.once('listening', resolve);
        server.listen(port);
    });
    server.close();
};

/**
 * 运行服务
 * @param {*} options
 * @param {*} ctx 
 * @returns 
 */
const server = async ({ port, useFile = false }, ctx) => {
    const { extend: { middlewarer } } = ctx;
    const app = connect();
    app._use_static_file = useFile;

    await probe(port);
    await Promise.map(middlewarer.list(), fun => Reflect.apply(fun, ctx, [app])); // 加载中间件
    return http.createServer(app).listen(port);
};

module.exports = function (port, useFile) {
    const { config, log } = this;
    server({ useFile, port }, this).then(() => {
        this.watch(config.server.cache).then(() => {
            log.clear(true);
            console.log(chalk.black(chalk.bgGreenBright(' DONE ')), chalk.greenBright('Compiled successfully'));
            console.log();
            console.log('  Serve running at:');
            console.log('  - Local:', chalk.blueBright(new URL(`http://localhost:${port}${config.site.root}`).toString()));
            console.log('  - Network:', chalk.blueBright(new URL(`http://${getIpv4()}:${port}${config.site.root}`).toString()));
            console.log();
            console.log('  If you want to stop service. Press Ctrl+C to stop.');
            console.log();
        });
    }).catch(err => {
        throw err;
    });
};