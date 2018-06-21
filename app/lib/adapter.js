module.exports = async (ctx, next) => {
    const _ctx = Object.assign({}, ctx);
    const deviceAgent = ctx.request.header['user-agent'].toLowerCase();
    const agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    ctx.render = async (view, options) => {
      if (agentID) {
          view = view + '-m';
      } else {
          view = view + '-p';
      }
      return _ctx.render(view, options)
    }
    await next();
}