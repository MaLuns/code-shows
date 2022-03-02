'use strict';

const fm = require('../uitls/front-matter');
const { assignIn } = require('lodash');
const { join, dirname } = require('path');

// 主题视图
class View {
    constructor(path, data) {
        this.path = path;
        this.source = join(this._theme.base, 'layout', path);
        this.data = typeof data === 'string' ? fm.parse(data) : data;
    }

    // 渲染模板
    render (options = {}) {
        const { layout = options.layout, _content: text } = this.data;
        const render = this._render;
        const locals = this._bindHelpers(this._loadLocals(options));
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

    // 获取全局 layout
    _resolveLayout (name) {
        // 相对路径
        const layoutPath = join(dirname(this.path), name);
        let layoutView = this._theme.getView(layoutPath);
        if (layoutView && layoutView.source !== this.source) return layoutView;

        // 绝对路径
        layoutView = this._theme.getView(name);
        if (layoutView && layoutView.source !== this.source) return layoutView;
    }

    // 绑定模版变量
    _loadLocals (locals) {
        return assignIn({}, locals, this.data, {
            filename: this.source
        });
    }

    // 绑定辅助函数
    _bindHelpers (locals) {
        const helpers = this._helper.list();
        const keys = Object.keys(helpers);

        for (const key of keys) {
            locals[key] = helpers[key].bind(locals);
        }

        return locals;
    }
}

module.exports = View;