'use strict';

const fm = require('../../uitls/front-matter');
const { join } = require('path');
const { createWriteStream, existsSync, mkdirSync } = require('../../uitls/fs');


function create (name, title, isDir) {
    const { source_dir } = this;
    const fileName = name.replace(/-/g, '_').toLowerCase();
    let fileWrite;
    if (isDir) {
        const dirPath = join(source_dir, fileName);
        if (!existsSync(dirPath)) {
            mkdirSync(dirPath);
            const path = join(dirPath, 'index.html');
            fileWrite = createWriteStream(path, { encoding: 'utf8' });
        }
    } else {
        const filePath = fileName.endsWith('.html') ? join(source_dir, fileName) : join(source_dir, fileName + '.html');
        if (!existsSync(filePath)) {
            fileWrite = createWriteStream(filePath, { encoding: 'utf8' });
        }
    }
    if (fileWrite) {
        fileWrite.end(fm.stringify({
            title,
            date: new Date(),
            description: null,
            tags: null,
            _content: '<style>\n\n</style>\n<template>\n\n</template>\n<script>\n\n</script>'
        }), { encoding: 'utf8' }, () => {
            this.log.debug(`Created: ${fileWrite.path}`);
        });
    } else {
        this.log.debug('File or folder already exist.');
    }
}

module.exports = create;