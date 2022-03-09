'use strict';

const { isPlainObject } = require('../../uitls');

module.exports = function (name, val) {
    if (![null, undefined].includes(val) && typeof name === 'string') {
        let varStr = Array.isArray(val) || (isPlainObject(val) && val.toString === Object.prototype.toString)
            ? JSON.stringify(val, null, 2)
            : String(val);
        return `<script>window.${name}=${varStr}</script>`;
    }
};