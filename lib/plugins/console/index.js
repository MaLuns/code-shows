'use strict';

const figlet = require('figlet');
const generate = require('./generate');
const create = require('./new');
const clean = require('./clean');
const deploy = require('./deploy');
const serve = require('./serve');

module.exports = function (ctx) {
    const { console } = ctx.extend;

    // 初始化
    console.program
        .command('init')
        .arguments('<name>', 'Please enter a project name')
        .description('Setup your code-shows')
        .action(function (args) {
            require('./init')(args, ctx.base_dir);
        });

    // 新增代码片段目录
    console.program
        .command('new')
        .arguments('<name>', 'Please enter a code snippet name')
        .option('-t, --title <title>', 'Please enter a code snippet title')
        .option('-a, --asset', 'Code snippets that need to use static files')
        .description('Create a new code snippet')
        .action(function (args, cmd) {
            Reflect.apply(create, ctx, [args, cmd.title, cmd.asset]);
        });

    // 本地服务
    console.program
        .command('serve [port]')
        .alias('s')
        .description('Start the server')
        .action(function (args = 3000) {
            Reflect.apply(serve, ctx, [args]);
        });

    // 生成静态文件
    console.program
        .command('generate')
        .alias('g')
        .option('-c, --clean', 'Clear cache files')
        .description('Generate static files')
        .action(function (args) {
            if (args.clean) {
                Reflect.apply(clean, ctx, [args]).then(() => {
                    Reflect.apply(generate, ctx, [args]);
                });
            } else {
                Reflect.apply(generate, ctx, [args]);
            }
        });

    // 清理缓存文件
    console.program
        .command('clean')
        .alias('c')
        .description('Clear cache files')
        .action(function (args) {
            Reflect.apply(clean, ctx, [args]);
        });

    // 部署
    console.program
        .command('deploy')
        .alias('d')
        .description('Deploying to the server')
        .action(function (args) {
            Reflect.apply(deploy, ctx, [args]);
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