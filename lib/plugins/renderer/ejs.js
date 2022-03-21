'use strict';

const ejs = require('ejs');

function ejsRenderer (data, options = {}) {
    return ejs.render(data.text, options);
}

module.exports = ejsRenderer;
