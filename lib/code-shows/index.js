'use strict';

const { EventEmitter } = require('events');
const logger = require('../uitls/log')
const { Console, Renderer, Builder } = require('../extend')
const { sep, join, dirname } = require('path');
const { version } = require('../../package.json');

class CodeShows extends EventEmitter {
    constructor(base = process.cwd(), args = {}) {
        super()
        this.version = version
        this.base_dir = base + sep;
        this.public_dir = join(base, 'public') + sep; // 静态资源目录
        this.layout_dir = join(base, 'layout') + sep; // 布局目录
        this.styles_dir = join(base, 'styles') + sep; // 布局样式目录
        this.script_dir = join(base, 'scripts') + sep;// 插件脚本 
        this.source_dir = join(base, 'source') + sep; // 源码目录

        this.env = {
            args,
            debug: Boolean(args.debug),
            env: process.env.NODE_ENV || 'development',
            version,
            cmd: args._ ? args._[0] : '',
            init: false
        };
        this.log = logger

        // 扩展管理
        this.extend = {
            renderer: new Renderer(),
            console: new Console(),
            builder: new Builder()
        }

    }

    init () {

        // 加载内部插件 注册到扩展
        require('../plugins/console')(this);
        require('../plugins/renderer')(this);
        require('../plugins/builder')(this);

        this.extend.console.program.parse()
    }

}

module.exports = CodeShows;