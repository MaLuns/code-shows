'use strict';

const figlet = require('figlet');
const generate = require('./generate');
const create = require('./new');
const clean = require('./clean');
const deploy = require('./deploy');

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

    // 新增代码片段目录
    console.program
        .command('new')
        .arguments('<name>', 'Please enter a code snippet name')
        .option('-t, --title <title>', 'Please enter a code snippet title')
        .option('-a, --asset', 'Code snippets that need to use static files')
        .description('Create a new code snippet')
        .action(function (arg, cmd) {
            Reflect.apply(create, ctx, [arg, cmd.title, cmd.asset]);
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
        .option('-c, --clean', 'Clear cache files')
        .description('Generate static files')
        .action(function (arg) {
            if (arg.clean) {
                Reflect.apply(clean, ctx, [arg]).then(() => {
                    Reflect.apply(generate, ctx, [arg]);
                });
            } else {
                Reflect.apply(generate, ctx, [arg]);
            }
        });

    // 清理缓存文件
    console.program
        .command('clean')
        .alias('c')
        .description('Clear cache files')
        .action(function (arg) {
            Reflect.apply(clean, ctx, [arg]);
        });

    //
    console.program
        .command('deploy')
        .alias('d')
        .description('Deploying to the server')
        .action(function () {
            Reflect.apply(deploy, ctx, []);
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