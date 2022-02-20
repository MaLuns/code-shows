'use strict';

const figlet = require('figlet');
const generate = require('./generate');

module.exports = function (ctx) {
    const { console } = ctx.extend;

    // 初始化
    console.program
        .command('init')
        .arguments('<name>', 'Please enter a project name')
        .description('Setup your code-shows')
        .action(function (arg) {
            require('./init')(arg, ctx.base_dir);
        });

    // 本地服务
    console.program
        .command('serve [port]')
        .alias('s')
        .description('Start the server')
        .action(function (arg = 3000, cmd) {
            ctx.log.info(arg, cmd);
            // require('../../')
        });

    // 生成静态文件
    console.program
        .command('generate')
        .alias('g')
        .description('Generate static files')
        .action(function (arg) {
            Reflect.apply(generate, ctx, [arg]);
        });

    // 版本信息
    console.program
        .version(ctx.version, '-v, --version', 'Display version number')
        .helpOption('-h, --help ', 'Display help')
        .action(() => {
            ctx.log.info('\n\n', figlet.textSync('code', { font: 'isometric1', horizontalLayout: 'full' }), '\n\n');
            console.program.help();
        });
};