'use strict';


const { Minimatch } = require('minimatch');

const test = (path, patterns) => {
    let matchs = [];
    if (typeof patterns === 'string') {
        matchs.path(new Minimatch(patterns));
    }
    if (Array.isArray(patterns)) {
        matchs = patterns.map(pattern => new Minimatch(pattern));
    }
    return matchs.some(match => match.match(path));
};

// 是否隐藏文件
const isHiddenFile = (path) => /(^|\/)[_.]/.test(path);
// 是否临时文件
const isTmpFile = (path) => path.endsWith('%') || path.endsWith('~');
// 是否代码文件
const isCodeFile = (path, include) => test(path, include);
// 是否需要排除文件
const isExcludeFile = (path, exclude) => test(path, exclude);
// 是否需要忽略文件
const isIgnoreFile = (path, ignore) => {
    return isHiddenFile(path) || isTmpFile(path) || test(path, ignore);
};

module.exports = {
    isHiddenFile,
    isTmpFile,
    isCodeFile,
    isExcludeFile,
    isIgnoreFile
};
