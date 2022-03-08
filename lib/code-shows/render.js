'use strict';

const Promise = require('bluebird');
const { getExtname } = require('../uitls');
const { readFileSync, readFile } = require('../uitls/fs');

class Render {
    constructor(ctx) {
        this.context = ctx;
        this.renderer = ctx.extend.renderer;
    }

    get (path) {
        return this.renderer.get(path);
    }

    isRenderable (path) {
        return this.renderer.isRenderable(path);
    }

    getOutput (path) {
        return this.renderer.getOutput(path);
    }

    run (data, options = {}) {
        if (!data) return Promise.reject(new TypeError('No input file or string!'));

        const ctx = this.context;
        let promise;

        if (![undefined, null].includes(data.text)) {
            promise = Promise.resolve(data.text);
        } else if (!data.path) {
            return Promise.reject(new TypeError('No input file or string!'));
        } else {
            promise = readFile(data.path);
        }

        return promise.then(text => {
            data.text = text;
            const ext = data.engine || getExtname(data.path);

            if (ext && this.isRenderable(ext)) {
                const renderer = this.renderer.get(ext);
                return Reflect.apply(renderer.run, ctx, [data, options]);
            } else {
                return data;
            }
        });
    }

    runSync (data = {}, options) {
        const ctx = this.context;

        if (!data.text) {
            if (!data.path) throw new TypeError('No input file or string!');
            data.text = readFileSync(data.path, { encoding: 'utf-8' });
        }
        if (!data.text) throw new TypeError('No input file or string!');

        // 获取渲染器类型
        const ext = data.engine || getExtname(data.path);
        let result;

        if (ext && this.isRenderable(ext)) {
            // 使用渲染器处理
            const renderer = this.renderer.get(ext);
            result = Reflect.apply(renderer.run, ctx, [data, options]);
        } else {
            // 直接返回文本
            result = data.text;
        }

        return result;
    }
}

module.exports = Render;