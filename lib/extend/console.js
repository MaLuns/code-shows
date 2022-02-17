'use strict';

const { Command } = require('commander');

// 命令行
class Console {
    constructor() {
        this.program = new Command();
    }
}

module.exports = Console;