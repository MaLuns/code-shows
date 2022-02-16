class Render {
    constructor(ctx) {
        this.context = ctx;
        this.renderer = ctx.extend.renderer;
    }
}

module.exports = Render