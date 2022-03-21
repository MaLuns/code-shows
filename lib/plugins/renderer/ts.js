'use strict';

const ts = require('typescript');

function tsRenderer (data, options = { module: 'es2015' }) {
    return ts.transpileModule(data.text, {
        reportDiagnostics: true,
        compilerOptions: {
            ...options
        }
    }).outputText;
}

module.exports = tsRenderer;
