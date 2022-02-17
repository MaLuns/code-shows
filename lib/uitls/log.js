const chalk = require('chalk');

const TRACE = 10;
const DEBUG = 20;
const INFO = 30;
const WARN = 40;
const ERROR = 50;

class Logger {
    static _writeLogOutput (level, consoleArgs) {
        if (level === TRACE) {
            console.trace(chalk.redBright(...consoleArgs));
        } else if (level < INFO) {
            console.debug(chalk.cyanBright(...consoleArgs));
        } else if (level < WARN) {
            console.info(...consoleArgs);
        } else if (level < ERROR) {
            console.warn(chalk.yellowBright(...consoleArgs));
        } else {
            console.error(chalk.redBright(...consoleArgs));
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
}


module.exports = Logger;