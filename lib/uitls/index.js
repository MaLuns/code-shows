const { extname } = require('path');

/**
 * 获取扩展名
 * @param {*} str 
 * @returns 
 */
const getExtname = str => {
    if (typeof str !== 'string') return '';
    const ext = extname(str) || str;
    return ext.startsWith('.') ? ext.slice(1) : ext;
}

/**
 * 拆分代码片段
 * @param {*} str 
 * @returns 
 */
const splitCode = str => {
    const getCodeStr = tag => {
        let res = new RegExp(`<${tag}.*<\/${tag}>`, 'gs').exec(str);
        if (res) {
            str = str.replace(res[0], '')
            return res[0]
        } else {
            return null
        }
    }
    return {
        script: getCodeStr('script'),
        html: getCodeStr('template'),
        style: getCodeStr('style')
    }
}

module.exports = {
    getExtname,
    splitCode
}