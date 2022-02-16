'use strict';

const { readFileTextSync } = require('../../uitls/fs')

const jsonRenderer = (path) => {
    const text = readFileTextSync(path)
    return JSON.parse(text)
};

module.exports = jsonRenderer;
