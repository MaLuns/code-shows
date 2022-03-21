'use strict';

const sass = require('sass');

function scssRenderer (data) {
    return sass.compileString(data.text);
}

module.exports = scssRenderer;