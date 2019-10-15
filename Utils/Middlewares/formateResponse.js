

export default async function formatResponse(ctx, next) {
    
    await next()

    if(ctx.body && (!ctx.status || (ctx.status >= 200 && ctx.status < 400))) {
        ctx.body = {
            code: ctx.status || 200,
            msg: 'success',
            data: ctx.body,
        }
    } else {
        ctx.body = {
            code: ctx.status || 500,
            data: null,
            msg: (ctx.body || {}).message || ''
        }
    }
}