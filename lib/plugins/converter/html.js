'use strict';

module.exports = async function (str) {
    let { render } = this;
    const getCodeStr = async (tag) => {
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
            return {
                language,
                text: await render.run({ engine: language, text: text.trim() }),
                source: text.trim(),
            };
        }
    };
    let code = {};
    let preview = {};

    let html = await getCodeStr('template');
    if (html) {
        let { text, ...res } = html;
        code.html = res;
        preview.html = text;
    }

    let style = await getCodeStr('style');
    if (style) {
        let { text, ...res } = style;
        code.style = res;
        preview.style = text;
    }

    let script = await getCodeStr('script');
    if (script) {
        let { text, ...res } = script;
        code.script = res;
        preview.script = text;
    }

    return {
        code,
        preview
    };
};