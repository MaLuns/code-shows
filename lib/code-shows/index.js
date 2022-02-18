'use strict';

const _ = require('lodash');
const logger = require('../uitls/log');
const defConfig = require('./def_config');
const Render = require('./render');
const Router = require('./router');
const Source = require('./source');
const { EventEmitter } = require('events');
const { sep, join } = require('path');
const { Console, Renderer, Builder } = require('../extend');
const { existsSync } = require('../uitls/fs');
const { version } = require('../../package.json');

class CodeShows extends EventEmitter {
    constructor(base = process.cwd(), args = {}) {
        super();
        this.version = version;
        this.base_dir = base + sep;
        this.config_path = join(base, 'code.config.json');
        this.public_dir = join(base, 'public') + sep; // 静态资源目录
        this.layout_dir = join(base, 'layout') + sep; // 布局目录
        this.styles_dir = join(base, 'styles') + sep; // 布局样式目录
        this.script_dir = join(base, 'scripts') + sep;// 插件脚本 
        this.source_dir = join(base, 'source') + sep; // 源码目录

        this.log = logger;
        this.config = { ...defConfig };

        this.env = {
            args,
            debug: Boolean(args.debug),
            env: process.env.NODE_ENV || 'development',
            version,
            cmd: args._ ? args._[0] : '',
            init: false
        };

        // 扩展管理
        this.extend = {
            renderer: new Renderer(),
            console: new Console(),
            builder: new Builder()
        };

        this.render = new Render(this);
        this.route = new Router(this);
        this.source = new Source(this);
    }

    init () {
        const argv = process.argv;
        const program = this.extend.console.program;
        // 注册命令和外部扩展命令
        require('../plugins/console')(this);

        const cmds = _.flatten(program.commands.map(item => [item.alias(), item.name()]));
        if (argv.length > 2 && cmds.includes(argv[2])) {
            this.log.info('Loading plugins');
            // 加载内部插件
            require('../plugins/renderer')(this);
            require('../plugins/builder')(this);
            // 加载外部插件
            this._load_plugins();
            this.log.info('Loaded plugins');

            // 加载配置文件
            this._load_config();
        }
        this.emit('reader');
        program.parse();
    }

    // 加载配置文件
    _load_config () {
        if (existsSync(this.config_path)) {
            let config = this.render.renderSync({ path: this.config_path });
            this.config = _.merge(config);
            this.log.debug(`Config loaded: ${this.config_path}`);
        }
    }

    // 加载插件
    _load_plugins () {

    }

    // 
    load () {
        this.log.info('Start processing');
        return Promise.all([
            this.source.build()
        ]);
    }
}

module.exports = CodeShows;