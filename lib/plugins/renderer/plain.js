'use strict';

// 无需额外处理的渲染器 
const renderer = async (data) => {
    return data.text;
};

module.exports = renderer;