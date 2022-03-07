'use strict';

const chalk = require('chalk');
const { Console } = require('console');

const TRACE = 10;
const DEBUG = 20;
const INFO = 30;
const WARN = 40;
const ERROR = 50;

const chalkColors = {
    10: chalk.redBright,
    20: chalk.blueBright,
    30: chalk.greenBright,
    40: chalk.yellowBright,
    50: chalk.magentaBright,
};

const logStr = {
    10: 'TRACE ',
    20: 'DEBUG ',
    30: 'INFO ',
    40: 'WARN ',
    50: 'ERROR ',
};

const console = new Console({
    stdout: process.stdout,
    stderr: process.stderr,
    colorMode: false
});

class Logger {
    static _writeLogOutput (level, consoleArgs) {
        if (level === TRACE || level >= WARN) {
            process.stderr.write(chalkColors[level](logStr[level]));
        } else {
            process.stdout.write(chalkColors[level](logStr[level]));
        }

        if (level === TRACE) {
            console.trace(...consoleArgs);
        } else if (level < INFO) {
            console.debug(...consoleArgs);
        } else if (level < WARN) {
            console.info(...consoleArgs);
        } else if (level < ERROR) {
            console.warn(...consoleArgs);
        } else {
            console.error(...consoleArgs);
        }
    }

    static trace (...args) {
        Logger._writeLogOutput(TRACE, args);
    }

    static debug (...args) {
        Logger._writeLogOutput(DEBUG, args);
    }

    static info (...args) {
        Logger._writeLogOutput(INFO, args);
    }

    static warn (...args) {
        Logger._writeLogOutput(WARN, args);
    }

    static error (...args) {
        Logger._writeLogOutput(ERROR, args);
    }

    static clear (isSoft) {
        process.stdout.write(
            isSoft ? '\x1B[H\x1B[2J' : '\x1B[2J\x1B[3J\x1B[H\x1Bc'
        );
    }
}


module.exports = Logger;