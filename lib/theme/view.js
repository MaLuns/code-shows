'use strict';

const { join } = require('path');

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

    }
}

module.exports = View;