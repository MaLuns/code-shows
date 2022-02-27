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
const { loadConfig, loadPlugins, loadConsole } = require('./load');
const { Console, Renderer, Builder, Generator, Helper } = require('../extend');
const { version } = require('../../package.json');
const defConfig = require('./def_config');
const { castArray, escapeBackslash } = require('../uitls');


function createLoadThemeRoute (result, locals, ctx) {
    const { theme } = ctx;

    const layout = [...new Set(castArray(result.layout))];
    const layoutLength = layout.length;

    locals.cache = true;

    return () => {
        for (let i = 0; i < layoutLength; i++) {
            const name = layout[i];
            const view = theme.getView(name);
            if (view) {
                return view.render(locals);
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
        this.db_path = join(base, 'db.json'); // 缓存db文件
        this.assets_dir = join(base, 'assets') + sep; // 资源目录
        this.source_dir = join(base, 'source') + sep; // 源码目录
        this.script_dir = join(base, 'script') + sep;// 插件脚本 
        this.theme_dir = join(base, 'theme') + sep; // 布局目录
        this.dist_dir = join(base, 'dist') + sep; // 生成静态文件目录
        this.theme_script_dir = join(this.theme_dir, 'scripts') + sep;

        this.skip_console = ['new', 'init', 'clean', 'c']; // 无需注册扩展等命令
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
            generator: new Generator(),
            helper: new Helper(),
        };

        this.db = new DataBase(this);
        this.render = new Render(this);
        this.route = new Router(this);
        this.source = new Source(this);
        this.theme = new Theme(this);
    }

    async init () {
        const argv = process.argv;
        const program = this.extend.console.program;

        // 注册命令和外部扩展命令
        await loadConsole(this);
        const cmds = _.flatten(program.commands.map(item => [item.alias(), item.name()]))
            .filter(key => !this.skip_console.includes(key));

        if (argv.length > 2 && cmds.includes(argv[2])) {
            await loadConfig(this); // 加载配置文件
            await loadPlugins(this); // 加载插件
            await this.db.load_db(); // 加载缓存数据
        }
        this.emit('reader');
        program.parse();
    }

    // 
    load (callback) {
        this.log.info('开始加载源文件...');
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

    // 运行生成器
    _runGenerators () {
        const db = this.db;
        const generators = this.extend.generator.list();

        return Promise.map(Object.keys(generators), key => {
            const generator = generators[key];
            this.log.info(`运行生成器: ${key}`);
            return Reflect.apply(generator, this, [db]);
        }).reduce((result, data) => {
            return data ? result.concat(data) : result;
        }, []);
    }

    // 更新路由
    _routerReflesh (runningGenerators, useCache) {
        const { route } = this;

        const Locals = this._generateLocals();
        Locals.prototype.cache = useCache;

        // const routeList = route.list();
        return runningGenerators.map(result => {
            if (typeof result !== 'object' || result.path === null) return undefined;

            const path = route.format(result.path);
            const { layout, data } = result;

            if (layout) {
                const locals = new Locals(path, data);
                route.set(path, createLoadThemeRoute(result, locals, this));
            } else {
                route.set(path, data);
            }
            return path;
        });
    }

    // 创建render全局变量
    _generateLocals () {
        const { config, env, theme_dir, db } = this;

        class Locals {
            constructor(path, page) {
                this.page = { ...page };
                if ([null, undefined].includes(this.page.path)) this.page.path = path;
                this.path = path;
                this.config = config;
                this.layout = 'layout';
                this.env = env;
                this.view_dir = join(theme_dir, 'layout') + sep;
                this.site = db.site();
            }
        }

        return Locals;
    }

    // 获取相对路径
    relativePath (path) {
        const baseDirLength = this.base_dir.length;
        return escapeBackslash(sep + path.substring(baseDirLength));
    }
}

module.exports = CodeShows;