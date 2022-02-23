'use strict';

const fm = require('../uitls/front-matter');
const { assignIn } = require('lodash');
const { join, dirname } = require('path');

class View {
    constructor(path, data) {
        this.path = path;
        this.source = join(this._theme.base, 'layout', path);
        this.data = typeof data === 'string' ? fm.parse(data) : data;
    }

    render (options = {}) {
        const { layout = options.layout, _content: text } = this.data;
        const render = this._render;
        const locals = this._buildLocals(options);
        const data = {
            path: this.source,
            text
        };

        // 渲染 code 设置的局部 layout
        return render.run(data, locals).then(result => {
            if (!result || !layout) return result;
            // 渲染全局 layout

            const layoutView = this._resolveLayout(layout);
            if (!layoutView) return result;

            const layoutLocals = {
                ...locals,
                body: result,
                layout: false
            };
            return layoutView.render(layoutLocals);
        });

    }

    _buildLocals (locals) {
        return assignIn({}, locals, {
            filename: this.source
        });
    }

    _resolveLayout (name) {
        // 相对路径
        const layoutPath = join(dirname(this.path), name);
        let layoutView = this._theme.getView(layoutPath);
        if (layoutView && layoutView.source !== this.source) return layoutView;

        // 绝对路径
        layoutView = this._theme.getView(name);
        if (layoutView && layoutView.source !== this.source) return layoutView;
    }

    // 
    _bindHelpers () {
        return {};
    }
}

module.exports = View;