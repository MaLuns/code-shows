'use strict';

const isHiddenFile = (path) => /(^|\/)[_.]/.test(path);
const isTmpFile = (path) => path.endsWith('%') || path.endsWith('~');


module.exports = {
    isHiddenFile,
    isTmpFile
};