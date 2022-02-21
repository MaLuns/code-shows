'use strict';

const Stream = require('stream');
const { Readable } = Stream;
const { EventEmitter } = require('events');


class RouteStream extends Readable {
    constructor(data) {
        super({ objectMode: true });

        this._data = data.data;
        this._ended = false;
        this.modified = data.modified;
    }

    _toBuffer (data) {
        if (data instanceof Buffer) {
            return data;
        }
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        if (typeof data === 'string') {
            return Buffer.from(data);
        }
        return null;
    }
}

// 路由管理
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
        if ([undefined, null].includes(data)) return;
        return new RouteStream(data);
    }

    set (path, data) {
        if (typeof path !== 'string') throw new TypeError('path must be a string!');
        if (data === null) throw new TypeError('data is required!');
    }

    // 删除路由
    remove (path) {
        if (typeof path !== 'string') throw new TypeError('path must be a string!');
        path = this.format(path);

        this.routes[path] = null;
        this.emit('remove', path);

        return this;
    }
}

module.exports = Router;
