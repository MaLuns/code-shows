'use strict';

const Promise = require('bluebird');
const fs = require('graceful-fs');
const fsPromises = fs.promises;
const { join } = require('path');

/**
 * 判断路径是否存
 * @param {*} path 
 * @returns 
 */
const exists = (path) => {
    if (!path) throw new TypeError('path is required!');
    const promise = fsPromises.access(path).then(() => true, err => {
        if (err.code !== 'ENOENT') throw err;
        return false;
    });

    return Promise.resolve(promise);
};

/**
 * 判断路径是否存
 * @param {*} path 
 * @returns 
 */
const existsSync = (path) => {
    if (!path) throw new TypeError('path is required!');
    try {
        fs.accessSync(path);
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
        return false;
    }

    return true;
};

const _rmdir = async (path) => {
    const files = fsPromises.readdir(path, { withFileTypes: true });
    await Promise.map(files, item => {
        const childPath = join(path, item.name);

        return item.isDirectory() ? _rmdir(childPath) : fsPromises.unlink(childPath);
    });
    return fsPromises.rmdir(path);
};

/**
 * 删除文件夹
 * @param {*} path 
 */
const rmdir = (path) => {
    if (!path) throw new TypeError('path is required!');
    return Promise.resolve(_rmdir(path));
};

/**
 * 
 * @param {*} path 
 */
const _rmdirSync = (path) => {
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
};

/**
 * 同步删除文件夹
 * @param {*} path 
 */
const rmdirSync = (path) => {
    if (!path) throw new TypeError('path is required!');
    _rmdirSync(path);
};

/**
 * 读取文件内容
 * @param {*} path 
 * @param {*} options 
 * @returns 
 */
const readFile = (path, options = {}) => {
    if (!path) throw new TypeError('path is required!');
    if (!Object.prototype.hasOwnProperty.call(options, 'encoding')) options.encoding = 'utf8';

    return Promise.promisify(fs.readFile)(path, options);
};

/**
 * 同步-读取文件内容 
 * @param {*} path 
 * @param {*} options 
 * @returns 
 */
const readFileSync = (path, options = {}) => {
    if (!path) throw new TypeError('path is required!');
    if (!Object.prototype.hasOwnProperty.call(options, 'encoding')) options.encoding = 'utf8';

    return fs.readFileSync(path, options);
};

/**
 * 读取文件夹目录 
 * @param {*} path 
 * @param {*} prefix 
 * @returns 
 */
const readFolderDir = (path, prefix = '') => {
    const files = fs.readdirSync(path, { withFileTypes: true });
    const results = [];

    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const prefixdPath = `${prefix}${file.name}`;
        if (file.isDirectory()) {
            results.push(...readFolderDir(join(path, file.name), `${prefixdPath}/`));
        }
        if (file.isFile()) {
            results.push(prefixdPath);
        }
    }
    return results;
};


// 判断目录是否存在
exports.exists = exists;
exports.existsSync = existsSync;

// 读取目录的内容
exports.readdir = Promise.promisify(fs.readdir);
exports.readdirSync = fs.readdirSync;

// 获取文件的信息
exports.stat = Promise.promisify(fs.stat);
exports.statSync = fs.statSync;
exports.fstat = Promise.promisify(fs.fstat);
exports.fstatSync = fs.fstatSync;
exports.lstat = Promise.promisify(fs.lstat);
exports.lstatSync = fs.lstatSync;

// 删除目录
exports.rmdir = rmdir;
exports.rmdirSync = rmdirSync;

// 删除文件或符号链接
exports.unlink = Promise.promisify(fs.unlink);
exports.unlinkSync = fs.unlinkSync;

// 读取文件
exports.readFile = readFile;
exports.readFileSync = readFileSync;
exists.readFolderDir = readFolderDir;

// createStream
exports.createReadStream = fs.createReadStream;
exports.createWriteStream = fs.createWriteStream;