'use strict';

const ejs = require('ejs');
const minify = require('html-minifier').minify;

function ejsRenderer (data, options = {}) {
    return minify(ejs.render(data.text, options), {
        minifyJS: true,
        removeComments: true,
        removeTagWhitespace: true
    });
}

module.exports = ejsRenderer;
