'use strict';

const _ = require('lodash');
const logger = require('../uitls/log');
const Promise = require('bluebird');
const Render = require('./render');
const Router = require('./router');
const DataBase = require('../database');
const Source = require('../source');
const Theme = require('../theme');
const { EventEmitter } = require('events');
const { sep, join } = require('path');
const { Console, Renderer, Builder, Generator } = require('../extend');
const { existsSync } = require('../uitls/fs');
const { version } = require('../../package.json');
const defConfig = require('./def_config');
const { castArray } = require('../uitls');


function createLoadThemeRoute (result, ctx, locals) {
    const { log, theme } = ctx;
    const { path, cache: useCache } = locals;

    const layout = [...new Set(castArray(result.layout))];
    const layoutLength = layout.length;

    locals.cache = true;

    return () => {
        for (let i = 0; i < layoutLength; i++) {
            const name = layout[i];
            const view = theme.getView(name);
            if (view) {
                console.log(path, view);
                return null;
                // return view.render(locals);
            }
        }
    };
}

class CodeShows extends EventEmitter {

    constructor(base = process.cwd(), args = {}) {
        super();
        this.version = version;
        this.base_dir = base + sep;
        this.config_path = join(base, 'code.config.json');
        this.db_path = join(base, 'db.json');
        this.assets_dir = join(base, 'assets') + sep; // 资源目录
        this.source_dir = join(base, 'source') + sep; // 源码目录
        this.script_dir = join(base, 'script') + sep;// 插件脚本 
        this.theme_dir = join(base, 'theme') + sep; // 布局目录
        this.dist_dir = join(base, 'dist') + sep; // 生成静态文件目录


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
            builder: new Builder(),
            generator: new Generator()
        };

        this.db = new DataBase();
        this.render = new Render(this);
        this.route = new Router(this);
        this.source = new Source(this);
        this.theme = new Theme(this);
    }

    init () {
        const argv = process.argv;
        const program = this.extend.console.program;

        // 注册命令和外部扩展命令
        require('../plugins/console')(this);

        const cmds = _.flatten(program.commands.map(item => [item.alias(), item.name()]))
            .filter(key => !['new', 'init'].includes(key));

        if (argv.length > 2 && cmds.includes(argv[2])) {
            this.log.info('Loading plugins');
            // 加载内部插件
            require('../plugins/renderer')(this);
            require('../plugins/builder')(this);
            require('../plugins/generator')(this);

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
            let config = this.render.runSync({ path: this.config_path });
            this.config = _.merge(config);
            this.log.debug(`Config loaded: ${this.config_path}`);
        }
    }

    // 加载插件
    _load_plugins () {

    }

    // 
    load (callback) {
        this.log.info('Start building');
        return Promise
            .all([this.source.build(), this.theme.build()])
            .then(() => {
                return this._generate({ cache: false });
            })
            .asCallback(callback);
    }

    // 生成构建产物
    _generate (options = {}) {
        if (this._isGenerating) return;
        const useCache = options.cache;
        this._isGenerating = true;
        return this._routerReflesh(this._runGenerators(), useCache)
            .then(() => {
                this._isGenerating = false;
            });
    }

    // 运行构建器
    _runGenerators () {
        const db = this.db;
        const generators = this.extend.generator.list();

        return Promise.map(Object.keys(generators), key => {
            const generator = generators[key];
            this.log.debug(`Generator: ${key}`);
            return Reflect.apply(generator, this, [db]);
        }).reduce((result, data) => {
            return data ? result.concat(data) : result;
        }, []);
    }

    // 更新路由
    _routerReflesh (runningGenerators) {
        const { route } = this;
        // const routeList = route.list();
        return runningGenerators.map(result => {
            if (typeof result !== 'object' || result.path === null) return undefined;

            const path = route.format(result.path);
            const { layout, data } = result;

            if (layout) {
                route.set(path, createLoadThemeRoute(result, this, {}));
            } else {
                route.set(path, data);
            }
            return path;
        });
    }
}

module.exports = CodeShows;