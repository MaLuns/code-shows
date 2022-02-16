'use strict';

const less = require('less');
const { readFileTextSync } = require('../../uitls/fs')

const lessRenderer = async (path) => {
    const text = readFileTextSync(path)
    return await less.render(text).then(res => res.css)
}

module.exports = lessRenderer;