'use strict';

const pug = require('pug');

function pugRenderer (data, options = {}) {
    return pug.render(data.text, options);
}

module.exports = pugRenderer;