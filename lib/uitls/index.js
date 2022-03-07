'use strict';

const crypto = require('crypto');
const Module = require('module');
const os = require('os');
const { runInThisContext } = require('vm');
const { extname, dirname } = require('path');
const { createReadStream, readFile } = require('./fs');
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
        let text = null;
        let language = tag === 'template' ? 'html' : tag === 'style' ? 'css' : 'javascript';
        if (res) {
            str = str.replace(res[0], '');
            text = res[0]
                .trim()
                .replace(/\\(?=`)/g, '\\\\')
                .replace(/`/g, '\\`')
                .replace(RegExp(`^<${tag}.*>[\r\n]?|[\r\n]?</${tag}>$`, 'g'), '');

            if (text) {
                let lang = new RegExp(`^<${tag}.*?lang=["|']([a-zA-Z]+)["|']`, 'g').exec(res[0].trim());
                if (lang) {
                    console.log(lang);
                    language = lang[1];
                }
            }
        }
        return {
            language,
            text
        };
    };

    return {
        script: getCodeStr('script'),
        html: getCodeStr('template'),
        style: getCodeStr('style')
    };
};

/**
 * 包装数组
 * @param {*} obj 
 * @returns 
 */
const castArray = obj => { return Array.isArray(obj) ? obj : [obj]; };

/**
 * 路径拼接
 * @param {*} path 
 * @param {*} root 
 * @param {*} url 
 * @returns 
 */
const urlFormat = (path = '/', root, url) => {
    if (/^(#|\/\/|http(s)?:)/.test(path)) return path;
    if (root) {
        path = root + path;
    }
    if (url) {
        path = url + path;
    }
    return path;
};

/**
 * 加载脚本
 * @param {*} path 
 * @param {*} ctx 
 * @returns 
 */
const loadScript = async (path, ctx) => {
    return readFile(path).then(script => {
        const module = new Module(path);
        module.filename = path;
        module.paths = Module._nodeModulePaths(path);

        function req (path) {
            return module.require(path);
        }

        req.resolve = request => Module._resolveFilename(request, module);
        req.main = require.main;
        req.extensions = Module._extensions;
        req.cache = Module._cache;

        script = `(function(exports, require, module, __filename, __dirname, code){${script}\n});`;
        const fn = runInThisContext(script, path);
        return fn(module.exports, req, module, path, dirname(path), ctx);
    });
};

/**
 * 生成html标签
 * @param {*} tag 
 * @param {*} props 
 * @param {*} innerHTML 
 * @returns 
 */
const createTag = (tag, props, innerHTML = '') => {
    if (!tag || (!props && !innerHTML)) return;
    if (typeof props === 'string') {
        innerHTML = props;
        props = {};
    }
    const attrs = Object.keys(props).map(key => {
        return `${key}='${props[key]}' `;
    });
    if (Array.isArray(innerHTML)) {
        innerHTML = innerHTML.join('\n');
    }
    return `<${tag} ${attrs.join('')}>${innerHTML}</${tag}>`;
};

/**
 * 获取本机Ipv4
 * @returns 
 */
const getIpv4 = () => {
    let net = os.networkInterfaces();
    let ipv4;
    for (const key in net) {
        net[key].forEach(element => {
            if (element.address !== '127.0.0.1' && element.family.toLocaleLowerCase() === 'ipv4') ipv4 = element.address;
        });
    }
    return ipv4;
};

module.exports = {
    castArray,
    createSha1Hash,
    createTag,
    escapeBackslash,
    getFileHash,
    getExtname,
    getFileName,
    getIpv4,
    loadScript,
    splitCode,
    urlFormat,
};