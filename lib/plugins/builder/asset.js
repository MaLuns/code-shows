const Pattern = require('../../uitls/pattern');

const isExcludedFile = () => {

};

module.exports = ctx => {
    return {
        pattern: new Pattern(path => {
            if (isExcludedFile(path, ctx.config)) return;
        }),
        build (file) {
            if (file.params.renderable) {
                console.log(file);
            } else {
                console.log(file);
            }
        }
    };
};