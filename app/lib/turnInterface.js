module.exports = async (ctx, next) => {
    const _ctx = Object.assign({}, ctx);
    if (ctx.query.test === 'hw') {
        ctx.render = async (view, options) => {
            return _ctx.response.body = options;
        }
    }
    await next();
}