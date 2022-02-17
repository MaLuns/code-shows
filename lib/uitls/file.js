'use strict';

const { readFile, readFileSync, stat, statSync } = require('./fs');

class File {
    constructor({ source, path, params, type }) {
        this.source = source;
        this.path = path;
        this.params = params;
        this.type = type;
    }

    read (options) {
        return readFile(this.source, options);
    }

    readSync (options) {
        return readFileSync(this.source, options);
    }

    stat () {
        return stat(this.source);
    }

    statSync () {
        return statSync(this.source);
    }
}

File.TYPE_CREATE = 'create';
File.TYPE_UPDATE = 'update';
File.TYPE_SKIP = 'skip'; // 跳过
File.TYPE_DELETE = 'delete';

module.exports = File;
