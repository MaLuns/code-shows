'use strict';

const Promise = require('bluebird');
const fs = require('graceful-fs');
const fsPromises = fs.promises;
const { join } = require('path');

function exists (path) {
    if (!path) throw new TypeError('path is required!');
    const promise = fsPromises.access(path).then(() => true, err => {
        if (err.code !== 'ENOENT') throw err;
        return false;
    });

    return Promise.resolve(promise);
}

function existsSync (path) {
    if (!path) throw new TypeError('path is required!');
    try {
        fs.accessSync(path);
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
        return false;
    }

    return true;
}

async function _rmdir (path) {
    const files = fsPromises.readdir(path, { withFileTypes: true });
    await Promise.map(files, item => {
        const childPath = join(path, item.name);

        return item.isDirectory() ? _rmdir(childPath) : fsPromises.unlink(childPath);
    });
    return fsPromises.rmdir(path);
}

function rmdir (path) {
    if (!path) throw new TypeError('path is required!');

    return Promise.resolve(_rmdir(path));
}

function _rmdirSync (path) {
    const files = fs.readdirSync(path, { withFileTypes: true });

    for (const item of files) {
        const childPath = join(path, item.name);

        if (item.isDirectory()) {
            _rmdirSync(childPath);
        } else {
            fs.unlinkSync(childPath);
        }
    }

    fs.rmdirSync(path);
}

function rmdirSync (path) {
    if (!path) throw new TypeError('path is required!');

    _rmdirSync(path);
}

function readFileTextSync (path) {
    return fs.readFileSync(path, { encoding: 'utf-8' });
}


// exists
exports.exists = exists;
exports.existsSync = existsSync;

// readdir
exports.readdir = Promise.promisify(fs.readdir);
exports.readdirSync = fs.readdirSync;

// stat
exports.stat = Promise.promisify(fs.stat);
exports.statSync = fs.statSync;
exports.fstat = Promise.promisify(fs.fstat);
exports.fstatSync = fs.fstatSync;
exports.lstat = Promise.promisify(fs.lstat);
exports.lstatSync = fs.lstatSync;

// rmdir
exports.rmdir = rmdir;
exports.rmdirSync = rmdirSync;

// unlink
exports.unlink = Promise.promisify(fs.unlink);
exports.unlinkSync = fs.unlinkSync;

// readFile
exports.readFile = Promise.promisify(fs.readFile);
exports.readFileSync = fs.readFileSync;
exports.readFileTextSync = readFileTextSync;