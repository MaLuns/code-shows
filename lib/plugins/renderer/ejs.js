'use strict';

const ejs = require('ejs');
const minify = require('html-minifier').minify;

function ejsRenderer (data, options = {}) {
    const opt = {
        minifyJS: true,
        removeComments: true,
        removeTagWhitespace: true
    };

    if (options.env.env === 'development') {
        return ejs.render(data.text, options);
    } else {
        return minify(ejs.render(data.text, options), opt);
    }
}

module.exports = ejsRenderer;
