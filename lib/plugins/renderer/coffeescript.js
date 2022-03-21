'use strict';

const coffeescript = require('coffeescript');


function coffeescriptRenderer (data, options = {}) {
    return coffeescript.compile(data.text, options);
}

module.exports = coffeescriptRenderer;
