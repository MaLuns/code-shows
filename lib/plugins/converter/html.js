'use strict';

module.exports = function (str) {
    const getCodeStr = tag => {
        let res = new RegExp(`<${tag}.*</${tag}>`, 'gs').exec(str);
        let text = '';
        let language = tag === 'template' ? 'html' : tag === 'style' ? 'css' : 'javascript';
        if (res) {
            str = str.replace(res[0], '');
            text = res[0]
                .trim()
                .replace(/\\(?=`)/g, '\\\\')
                .replace(/`/g, '\\`')
                .replace(RegExp(`^<${tag}.*>[\r\n]?|[\r\n]?</${tag}>$`, 'g'), '');

            if (text) {
                let lang = new RegExp(`^<${tag}.*?lang=["|']([a-zA-Z]+)["|']`, 'g').exec(res[0].trim());
                if (lang) {
                    language = lang[1];
                }
            }
        }
        return {
            language,
            text: text.trim(),
            source: text.trim(),
        };
    };

    return {
        html: getCodeStr('template'),
        style: getCodeStr('style'),
        script: getCodeStr('script'),
    };
};