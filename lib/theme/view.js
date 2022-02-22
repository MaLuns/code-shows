'use strict';

const { join, extname } = require('path');

class View {
    constructor(path, data) {
        this.path = path;
        this.source = join(this._theme.base, 'layout', path);
        this.data = data;
    }

    render (options = {}, callback) {
        if (!callback && typeof options === 'function') {
            callback = options;
            options = {};
        }

        const { data } = this;
        const { layout = options.layout } = data;

        const render = this._render;
        const ext = extname(this.path);
        render.run({
            path: this.source,
            text: this.data
        }, options).then(result => {

        });

    }

    // 
    _bindHelpers () {
        return {};
    }
}

module.exports = View;