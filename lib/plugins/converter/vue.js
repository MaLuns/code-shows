/* eslint-disable no-case-declarations */
'use strict';

const vue2Compiler = require('vue-template-compiler');
const vue3Compiler = require('@vue/compiler-sfc');
const babel = require('@babel/core');

const traverseVue2AddProperty = (path, t, data) => {
    path.traverse({
        ObjectExpression (path2) {
            if (path2.parent && path2.parent.type === 'NewExpression') {
                path2.node.properties.push(
                    // el
                    t.objectProperty(
                        t.identifier('el'),
                        t.stringLiteral('#app')
                    ),
                );
                if (data.html) {
                    // template
                    path2.node.properties.push(
                        t.objectProperty(
                            t.identifier('template'),
                            t.stringLiteral(data.html)
                        )
                    );
                }
                path2.stop();
            }
        }
    });
};

const parseVue2ScriptPlugin = (data) => {
    return function (babel) {
        let t = babel.types;
        return {
            visitor: {
                // 解析export default模块语法
                ExportDefaultDeclaration (path) {
                    // export default -> new Vue
                    path.replaceWith(
                        t.expressionStatement(
                            t.newExpression(
                                t.identifier('Vue'),
                                [
                                    path.get('declaration').node
                                ]
                            )
                        )
                    );
                    // 添加el和template属性
                    traverseVue2AddProperty(path, t, data);
                },
                // 解析module.exports模块语法
                AssignmentExpression (path) {
                    try {
                        let objectNode = path.get('left.object.name');
                        let propertyNode = path.get('left.property.name');
                        if (
                            objectNode &&
                            objectNode.node === 'module' &&
                            propertyNode &&
                            propertyNode.node === 'exports'
                        ) {
                            path.replaceWith(
                                t.newExpression(
                                    t.identifier('Vue'),
                                    [
                                        path.get('right').node
                                    ]
                                )
                            );
                            // 添加el和template属性
                            traverseVue2AddProperty(path, t, data);
                        }
                    } catch (error) {
                        // console.log(error)
                    }
                }
            }
        };
    };
};


const traverseVue3AddProperty = (path, t, data) => {
    let first = true;
    path.traverse({
        ObjectExpression (path2) {
            if (first) {
                first = false;
                if (data.html) {
                    path2.node.properties.push(
                        // template
                        t.objectProperty(
                            t.identifier('template'),
                            t.stringLiteral(data.html)
                        ),
                    );
                }
                path2.stop();
            }
        }
    });
};

const parseVue3ScriptPlugin = (data) => {
    return function (babel) {
        let t = babel.types;
        return {
            visitor: {
                // export default -> Vue.create
                ExportDefaultDeclaration (path) {
                    path.replaceWith(
                        t.expressionStatement(
                            t.callExpression(
                                t.memberExpression(
                                    t.callExpression(
                                        t.memberExpression(
                                            t.identifier('Vue'),
                                            t.identifier('createApp')
                                        ),
                                        [
                                            path.get('declaration').node
                                        ]
                                    ),
                                    t.identifier('mount')
                                ),
                                [
                                    t.stringLiteral('#app')
                                ]
                            )
                        )
                    );
                    traverseVue3AddProperty(path, t, data);
                }
            }
        };
    };
};

const parseVueComponentData = async (data, parseVueScriptPlugin) => {
    // babel编译，通过编写插件来完成对ast的修改
    let jsStr = data.script ? babel.transform(data.script, {
        root: __dirname,
        rootMode: 'upward',
        cwd: __dirname,
        presets: ['@babel/preset-env'],
        plugins: [
            parseVueScriptPlugin(data)
        ]
    }).code : '';
    return {
        html: '<div id="app"></div>',
        script: jsStr,
        style: data.style
    };
};

module.exports = (language) => async function (str) {
    let { render } = this;
    let code = {};
    let preview;

    switch (language) {
        case 'vue2':
            const component = vue2Compiler.parseComponent(str);

            if (component.template) {
                let language = component.template.lang || 'html';
                code.html = await render.run({ engine: language, text: component.template.content });
            }

            if (component.script) {
                let language = component.script.lang || 'javascript';
                code.script = await render.run({ engine: language, text: component.script.content });
            }

            if (component.styles.length > 0) {
                let style = component.styles[0];
                let language = style.lang || 'css';
                code.style = await render.run({ engine: language, text: style.content });
            }

            preview = await parseVueComponentData(code, parseVue2ScriptPlugin);
            break;
        case 'vue3':
            const { descriptor } = vue3Compiler.parse(str);
            let { scriptSetup, script, template, styles } = descriptor;

            if (template) {
                let language = template.lang || 'html';
                code.html = await render.run({ engine: language, text: template.content });
            }

            if (styles.length > 0) {
                let style = styles[0];
                let language = style.lang || 'css';
                code.style = await render.run({ engine: language, text: style.content });
            }

            if (scriptSetup) {
                let compiledScript = vue3Compiler.compileScript(descriptor, {
                    id: 'id',
                    refSugar: true
                });
                code.script = compiledScript.content;
            } else {
                code.script = script;
            }

            preview = await parseVueComponentData(code, parseVue3ScriptPlugin);

            preview.script = preview.script.replace('"use strict";', `
"use strict";
if (!window.require) {
    window.require = function(tar) {
        return tar === 'vue' ? window.Vue : window[tar];
    }
}`);
            break;
        default:
            break;
    }

    return {
        code: {
            html: {
                language,
                source: str.replace(/<\/script>/g, '<\\/script>')
            }
        },
        preview
    };
};