'use strict';

const { getExtname } = require('../uitls');
const { readFileSync } = require('../uitls/fs');

class Render {
    constructor(ctx) {
        this.context = ctx;
        this.renderer = ctx.extend.renderer;
    }

    isRenderable (path) {
        return this.renderer.isRenderable(path);
    }

    getRenderer (path) {
        return this.renderer.get(path);
    }

    render (data, options, callback) {
        if (!callback && typeof options === 'function') {
            callback = options;
            options = {};
        }
        if (!data) return Promise.reject(new TypeError('No input file or string!'));
    }

    renderSync (data = {}, options) {
        const ctx = this.context;

        if (!data.text) {
            if (!data.path) throw new TypeError('No input file or string!');
            data.text = readFileSync(data.path, { encoding: 'utf-8' });
        }
        if (!data.text) throw new TypeError('No input file or string!');

        // 获取渲染器类型
        const ext = data.engine || getExtname(data.path);
        // let output = ext;
        let result;
        if (data.onRenderStart) {
            result = data.onRenderStart(result);
        }

        if (ext && this.isRenderable(ext)) {
            const renderer = this.renderer.get(ext);
            // output = renderer.output;
            result = renderer.run.apply(ctx, [data, options]);
        } else {
            result = data.text;
        }

        if (data.onRenderEnd) {
            result = data.onRenderEnd(result);
        }

        return result;
    }
}

module.exports = Render;