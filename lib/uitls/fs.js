'use strict';

const Promise = require('bluebird');
const fs = require('graceful-fs');
const fsPromises = fs.promises;
const { join, dirname } = require('path');

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

/**
 * 写入文件
 * @param {*} path 
 * @param {*} data 
 * @param {*} options 
 * @returns 
 */
const writeFile = (path, data, options = {}) => {
    if (!path) throw new TypeError('path is required!');

    if (!data) data = '';

    return checkParent(path).then(() => fsPromises.writeFile(path, data, options));
};

/**
 * 写入文件
 * @param {*} path 
 * @param {*} data 
 * @param {*} options 
 */
const writeFileSync = (path, data, options) => {
    if (!path) throw new TypeError('path is required!');

    fs.mkdirSync(dirname(path), { recursive: true });
    fs.writeFileSync(path, data, options);
};

/**
 * 校验父级路径, 不存在先创建文件夹
 * @param {*} path 
 * @returns 
 */
const checkParent = (path) => {
    return Promise.resolve(fsPromises.mkdir(dirname(path), { recursive: true }));
};

/**
 * 读取文件目录
 * @param {*} path 
 * @param {*} prefix 
 * @returns 
 */
const readdirFilePaths = (path, prefix = '') => {
    const files = fs.readdirSync(path, { withFileTypes: true });
    const results = [];

    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const prefixdPath = `${prefix}${file.name}`;
        if (file.isDirectory()) {
            results.push(...readdirFilePaths(join(path, file.name), `${prefixdPath}/`));
        }
        if (file.isFile()) {
            results.push(prefixdPath);
        }
    }
    return results;
};

const ignoreHiddenFiles = (ignore) => {
    if (!ignore) return () => true;
    return ({ name }) => !name.startsWith('.');
};

const ignoreFilesRegex = (regex) => {
    if (!regex) return () => true;
    return ({ name }) => !regex.test(name);
};

const _readAndFilterDir = async (path, options) => {
    const { ignoreHidden = true, ignorePattern } = options;
    return (await fsPromises.readdir(path, { ...options, withFileTypes: true }))
        .filter(ignoreHiddenFiles(ignoreHidden))
        .filter(ignoreFilesRegex(ignorePattern));
};

const _copyDirWalker = (src, dest, results, parent, options) => {
    return Promise.map(_readAndFilterDir(src, options), item => {
        const childSrc = join(src, item.name);
        const childDest = join(dest, item.name);
        const currentPath = join(parent, item.name);

        if (item.isDirectory()) {
            return _copyDirWalker(childSrc, childDest, results, currentPath, options);
        }
        results.push(currentPath);
        return copyFile(childSrc, childDest);
    });
};

const copyDir = (src, dest, options = {}) => {
    if (!src) throw new TypeError('src is required!');
    if (!dest) throw new TypeError('dest is required!');
    const results = [];
    return checkParent(dest).then(() => _copyDirWalker(src, dest, results, '', options)).return(results);
};

const copyFile = (src, dest, flags) => {
    if (!src) throw new TypeError('src is required!');
    if (!dest) throw new TypeError('dest is required!');
    return checkParent(dest).then(() => fsPromises.copyFile(src, dest, flags));
};


// 判断目录是否存在
exports.exists = exists;
exports.existsSync = existsSync;

// 读取目录的内容
exports.readdir = Promise.promisify(fs.readdir);
exports.readdirSync = fs.readdirSync;
exports.readdirFilePaths = readdirFilePaths;

// 获取文件的信息
exports.stat = Promise.promisify(fs.stat);
exports.statSync = fs.statSync;
exports.fstat = Promise.promisify(fs.fstat);
exports.fstatSync = fs.fstatSync;
exports.lstat = Promise.promisify(fs.lstat);
exports.lstatSync = fs.lstatSync;

// 创建目录
exports.mkdir = Promise.promisify(fs.mkdir);
exports.mkdirSync = fs.mkdirSync;

// 复制
exports.copyDir = copyDir;
exports.copyFile = copyFile;

// 删除目录
exports.rmdir = rmdir;
exports.rmdirSync = rmdirSync;

// 删除文件或符号链接
exports.unlink = Promise.promisify(fs.unlink);
exports.unlinkSync = fs.unlinkSync;

// 读取文件
exports.readFile = readFile;
exports.readFileSync = readFileSync;
exports.readFolderDir = readFolderDir;

// 写入文件
exports.writeFile = writeFile;
exports.writeFileSync = writeFileSync;

// createStream
exports.createReadStream = fs.createReadStream;
exports.createWriteStream = fs.createWriteStream;