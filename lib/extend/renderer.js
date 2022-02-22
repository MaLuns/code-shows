'use strict';

const { getExtname } = require('../uitls');

// 渲染器 => 渲染构建产物
class Renderer {
    constructor() {
        this.store = {};
    }

    // 注册渲染器
    register (name, output, fun) {
        if (!name) throw new TypeError('name is required');
        if (!output) throw new TypeError('output is required');
        if (typeof fun !== 'function') throw new TypeError('fun must be a function');

        name = getExtname(name);

        this.store[name] = {
            run: fun,
            input: name,
            output: getExtname(output),
        };
    }

    // 获取渲染器
    get (path) {
        return this.store[getExtname(path)] || this.store[path];
    }

    // 判断文件是否有对应渲染器
    isRenderable (path) {
        return Boolean(this.get(path));
    }

    // 获取扩展名
    getOutput (path) {
        const renderer = this.get(path);
        return renderer ? renderer.output : '';
    }


}

module.exports = Renderer;