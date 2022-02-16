'use strict';

const { EventEmitter } = require('events');

class Router extends EventEmitter {
    constructor() {
        super();
        this.routes = {};
    }

    list () {
        const { routes } = this;
        return Object.keys(routes).filter(key => routes[key]);
    }

    format (path) {
        path = path || '';
        if (typeof path !== 'string') throw new TypeError('path must be a string!');
        path = path
            .replace(/^\/+/, '') // Remove prefixed slashes
            .replace(/\\/g, '/') // Replaces all backslashes
            .replace(/\?.*$/, ''); // Remove query string

        if (!path || path.endsWith('/')) {
            path += 'index.html';
        }

        return path;
    }

    get (path) {
        const data = this.cache[this.format(path)];
        if (data == null) return;
        return data.html
    }

    set (path, data) {
        if (typeof path !== 'string') throw new TypeError('path must be a string!');
        if (data == null) throw new TypeError('data is required!');

        let obj;
    }

    remove (path) {
        if (typeof path !== 'string') throw new TypeError('path must be a string!');
        path = this.format(path);

        this.routes[path] = null;
        this.emit('remove', path);

        return this;
    }
}

module.exports = Router;
