
/**
 * 参数集合处理，将所有参数转移到 ctx.rp 上，同时存在 与body 和query 上的参数会以body 为准
 */

export default async function paramsHandle(ctx, next) {
    ctx.reqParams = Object.assign({}, ctx.params || {}, ctx.query || {}, ctx.request.body || {})
    // console.log(ctx.params, ctx.query, ctx.request.body)
    await next()
}