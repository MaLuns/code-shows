'use strict';

const babel = require('@babel/core');


function babelRenderer (data, options = { presets: ['es2015', 'es2016', 'es2017', 'react'] }) {
    return babel.transform(data.text, options).code;
}

module.exports = babelRenderer;
