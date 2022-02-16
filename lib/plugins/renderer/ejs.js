'use strict';

const ejs = require('ejs');
const minify = require('html-minifier').minify;
const { readFileTextSync } = require('../../uitls/fs')

const _catch = {};
function ejsRenderer (path, options = {}) {
    let txt = _catch[path] ? _catch[path] : readFileTextSync(path)
    return minify(ejs.render(txt, options), {
        minifyJS: true,
        removeComments: true,
        removeTagWhitespace: true
    })
}

module.exports = ejsRenderer;
