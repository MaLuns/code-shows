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
                if (data.template && data.template.content) {
                    // template
                    path2.node.properties.push(
                        t.objectProperty(
                            t.identifier('template'),
                            t.stringLiteral(data.template.content)
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
                if (data.template && data.template.content) {
                    path2.node.properties.push(
                        // template
                        t.objectProperty(
                            t.identifier('template'),
                            t.stringLiteral(data.template.content)
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

const parseVueComponentData = async (data, parseVueScriptPlugin, render) => {
    // 编译html
    if (data.template && data.template.content) {
        let language = data.template.lang || 'html';
        data.template.content = await render.run({ engine: language, text: data.template.content });
    }

    // babel编译，通过编写插件来完成对ast的修改
    let jsStr = data.script ? babel.transform(data.script.content, {
        root: __dirname,
        rootMode: 'upward',
        cwd: __dirname,
        presets: ['@babel/preset-env'],
        plugins: [
            parseVueScriptPlugin(data)
        ]
    }).code : '';

    // 编译css
    let cssStr = [];
    if (data.styles) {
        for (let i = 0; i < data.styles.length; i++) {
            let style = data.styles[i];
            let language = style.lang || 'css';
            let cssData = await render.run({ engine: language, text: style.content });
            cssStr.push(cssData);
        }
    }

    return {
        html: '<div id="app"></div>',
        script: jsStr,
        style: cssStr.join('\r\n')
    };
};

module.exports = (language) => async function (str) {
    let { render } = this;
    let preview = {};
    let componentData;

    switch (language) {
        case 'vue2':
            componentData = vue2Compiler.parseComponent(str);
            preview = await parseVueComponentData(componentData, parseVue2ScriptPlugin, render);
            break;
        case 'vue3':
            componentData = vue3Compiler.parse(str);

            if (componentData.descriptor.scriptSetup) {
                componentData.descriptor.script = null;
                let compiledScript = vue3Compiler.compileScript(componentData.descriptor, {
                    refSugar: true,
                    id: 'scoped'
                });
                componentData.descriptor.script = {
                    content: compiledScript.content
                };
            }

            preview = await parseVueComponentData(componentData.descriptor, parseVue3ScriptPlugin, render);
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