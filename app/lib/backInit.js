module.exports = async (ctx, next) => {
    ctx.body = {
        code: -1,
        msg: '',
        data: '',
    };
    await next();
}