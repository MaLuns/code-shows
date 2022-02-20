'use strict';

const fm = require('front-matter');

function parse (str, options = {}) {
    if (typeof str !== 'string') throw new TypeError('str is required!');
    const result = fm(str, options);
    return {
        ...result.attributes,
        _content: result.body
    };
}

module.exports = {
    parse
};