'use strict';

const { getExtname } = require('../uitls');


class Renderer {
    constructor() {
        this.compilers = {}
    }

    register (name, output, fun) {
        if (!name) throw new TypeError('name is required');
        if (!output) throw new TypeError('output is required');
        if (typeof fun !== 'function') throw new TypeError('fun must be a function');

        name = getExtname(name)

        this.compilers[name] = {
            compile: fun,
            inputExtname: name,
            outputExtname: getExtname(output),
        }
    }

    get (name) {
        return this.compilers[getExtname(name)] || this.compilers[name];
    }

    isRenderable (path) {
        return Boolean(this.get(path));
    }

    async getOutput (path, options = {}) {
        const renderer = this.get(path);
        return renderer.compile(path, options)
    }

    getOutputSync (path, options = {}) {
        const renderer = this.get(path);
        return renderer.compile(path, options)
    }
}

module.exports = Renderer