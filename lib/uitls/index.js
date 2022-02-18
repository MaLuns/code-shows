'use strict';

const crypto = require('crypto');
const { extname } = require('path');
const { createReadStream } = require('./fs');
const ALGORITHM = 'sha1';

/**
 * SHA1
 * @returns 
 */
const createSha1Hash = () => crypto.createHash(ALGORITHM);

/**
 * 替换 \ 为 /
 * @param {*} path 
 * @returns 
 */
const escapeBackslash = (path) => path.replace(/\\/g, '/');// Replace backslashes on Windows

/**
 * 获取文件Hash
 * @param {*} path 
 */
const getFileHash = (path) => {
    const src = createReadStream(path);
    const hasher = createSha1Hash();

    const finishedPromise = new Promise((resolve, reject) => {
        src.once('error', reject);
        src.once('end', resolve);
    });

    src.on('data', chunk => { hasher.update(chunk); });

    return finishedPromise.then(() => hasher.digest('hex'));
};

/**
 * 获取扩展名
 * @param {*} str 
 * @returns 
 */
const getExtname = str => {
    if (typeof str !== 'string') return '';
    const ext = extname(str) || str;
    return ext.startsWith('.') ? ext.slice(1) : ext;
};

/**
 * 获取文件名
 * @param {*} str 
 * @returns 
 */
const getFileName = str => str.substr(0, str.lastIndexOf('.'));

/**
 * 拆分代码片段
 * @param {*} str 
 * @returns 
 */
const splitCode = str => {
    const getCodeStr = tag => {
        let res = new RegExp(`<${tag}.*</${tag}>`, 'gs').exec(str);
        if (res) {
            str = str.replace(res[0], '');
            return res[0];
        } else {
            return null;
        }
    };
    return {
        script: getCodeStr('script'),
        html: getCodeStr('template'),
        style: getCodeStr('style')
    };
};

module.exports = {
    createSha1Hash,
    escapeBackslash,
    getFileHash,
    getExtname,
    getFileName,
    splitCode,
};