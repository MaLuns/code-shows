'use strict';

const { Minimatch } = require("minimatch")

class Pattern {
    constructor(rule) {
        if (rule instanceof Pattern) {
            return rule;
        } else if (typeof rule === 'function') {
            this.match = rule;
        } else if (rule instanceof RegExp) {
            this.match = str => str.match(rule);
        } else if (typeof rule === 'string') {
            this.match = new Minimatch(rule);
        } else {
            throw new TypeError('rule must be a function, a string or a regular expression.');
        }
    }

    test (str) {
        return Boolean(this.match(str));
    }
}


module.exports = Pattern;