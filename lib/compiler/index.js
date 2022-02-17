const { EventEmitter } = require('events');
const { stat, readdir } = require('../uitls/fs');

class Compiler extends EventEmitter {
    constructor(ctx, base) {
        super();
        this.context = ctx;
        this.base = base;
    }

    _readDir (base) {
        // 文件夹信息
        return readdir(base, { withFileTypes: true }).then(path => {

        });
    }

    builde (callback) {
        const { base } = this;

        return stat(base).then(stats => {
            if (!stats.isDirectory()) return;
            return this._readDir(base).then(files => {
                console.log(files);
            });
        }).asCallback(callback);
    }
}

module.exports = Compiler;