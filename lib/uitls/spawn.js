'use strict';

const { spawn } = require('child_process');

function promiseSpawn (command, args = [], options = {}) {
    if (!command) throw new TypeError('command is required!');
    if (typeof args === 'string') args = [args];
    if (!Array.isArray(args)) {
        options = args;
        args = [];
    }

    return new Promise((resolve, reject) => {
        const task = spawn(command, args, options);

        task.on('close', code => {
            if (code) {
                return reject(code);
            }
            resolve();
        });

        task.on('error', reject);

        // Listen to exit events if neither stdout and stderr exist (inherit stdio)
        if (!task.stdout && !task.stderr) {
            task.on('exit', code => {
                if (code) {
                    const e = new Error('Spawn failed');
                    e.code = code;
                    return reject(e);
                }
                resolve();
            });
        }
    });
}

module.exports = promiseSpawn;