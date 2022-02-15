'use strict';

const ejs = require('ejs')

async function ejsRenderer (path, options = {}) {
    return await ejs.renderFile(path, options)
}

module.exports = ejsRenderer;
