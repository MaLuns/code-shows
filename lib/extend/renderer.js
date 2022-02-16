'use strict';

const { getExtname } = require('../uitls');

// 渲染器 => 渲染构建产物
class Renderer {
    constructor() {
        this.store = {}
    }

    register (name, output, fun) {
        if (!name) throw new TypeError('name is required');
        if (!output) throw new TypeError('output is required');
        if (typeof fun !== 'function') throw new TypeError('fun must be a function');

        name = getExtname(name)

        this.store[name] = {
            run: fun,
            input: name,
            output: getExtname(output),
        }
    }

    get (name) {
        return this.store[getExtname(name)] || this.store[name];
    }

    isRenderable (path) {
        return Boolean(this.get(path));
    }

    async getOutput (path, options = {}) {
        const renderer = this.get(path);
        return renderer.run(path, options)
    }

    getOutputSync (path, options = {}) {
        const renderer = this.get(path);
        return renderer.run(path, options)
    }
}

module.exports = Renderer