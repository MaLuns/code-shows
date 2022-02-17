const { EventEmitter } = require('events');
const { join } = require('path');
const { stat, readdirSync } = require('../uitls/fs');

const readDirFilePaths = (path, prefix = '') => {
    const files = readdirSync(path, { withFileTypes: true });
    const results = [];

    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const prefixdPath = `${prefix}${file.name}`;
        if (file.isDirectory()) {
            results.push(...readDirFilePaths(join(path, file.name), `${prefixdPath}/`));
        }
        if (file.isFile()) {
            results.push(prefixdPath);
        }
    }
    return results;
};

class Compiler extends EventEmitter {
    constructor(ctx, base) {
        super();
        this.context = ctx;
        this.base = base;
    }

    async _readDir (base, prefix = '') {
        return readDirFilePaths(base, prefix)
            .map(path => this._checkFileStatus(path))
            .map(file => this._buildFile(file.type, file.path).return(file.path));
    }

    _checkFileStatus () {

    }

    _buildFile () {

    }

    build (callback) {
        const { base } = this;

        return stat(base).then(async stats => {
            if (!stats.isDirectory()) return;
            const files = await this._readDir(base);
            console.log(files);
        }).asCallback(callback);
    }
}

module.exports = Compiler;