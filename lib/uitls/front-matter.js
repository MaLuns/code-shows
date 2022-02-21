'use strict';

const fm = require('front-matter');
const dayjs = require('dayjs');

function parse (str, options = {}) {
    if (typeof str !== 'string') throw new TypeError('str is required!');
    const result = fm(str, options);
    return {
        ...result.attributes,
        _content: result.body
    };
}

function stringify (obj, options = {}) {
    if (!obj) throw new TypeError('obj is required!');

    const { _content: content = '' } = obj;
    delete obj._content;
    if (!Object.keys(obj).length) return content;

    const keys = Object.keys(obj);
    const separator = options.separator || '---';
    let key, value, result;
    result = `${separator}\n`;

    for (let index = 0; index < keys.length; index++) {
        key = keys[index];
        value = obj[key];
        if ([null, undefined].includes(value)) {
            result += `${key}: \n`;
        } else if (value instanceof Date) {
            result += `${key}: ${dayjs(value).format('YYYY-MM-DD HH:mm:ss')}\n`;
        } else if (value instanceof Function) {
            result += `${key}: ${value()}\n`;
        } else {
            result += `${key}: ${value}\n`;
        }
    }
    result += `${separator}\n${content}`;
    return result;
}

module.exports = {
    parse,
    stringify
};