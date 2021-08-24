import fs from 'fs';
import path from 'path';
import Router from 'koa-router';

import { RequiredParamsError, KCError } from '../Error'

/**
 * get/post 等路由注解基本实现
 */
const router = (method, path) => {
    return (target, name, descriptor) => {
        if (!target.prototype._routes) {
            target.prototype._routes = []
        }
        target.prototype._routes.push({
            path,
            name,
            method
        });

        const _fn = descriptor.value;
        descriptor.value = async function (ctx, next) {
            await _fn.call(this, ctx, next);
            await next()
        }
    }
}


/**
 *  配置路由的 prefix
 */
export const Controller = path => target => {
    target.baseUrl = path;

}

export const GET = path => router('get', path)

export const POST = path => router('post', path)



/**
 * 日志记录
 */
export const log = (target, name, descriptor) => {
    const _fn = descriptor.value
    descriptor.value = async function (ctx, next) {
        console.log(`run ${name}`)
        await _fn.call(this, ctx, next);
    }
}

/**
 * 参数校验
 * 暂时不考虑路由参数的类型，可以在后期接入反射，校验参数类型
 */
export const Required = (requiredParams) => {
    if (!Array.isArray(requiredParams) || !requiredParams.length) {
        throw new Error('decorator required need params')
    }
    return (target, name, descriptor) => {
        const _fn = descriptor.value;

        descriptor.value = async function (ctx, next) {
            // ctx.body.params
            const params = ctx.rp;
            const missingParams = requiredParams.filter(v => params[v] === undefined)
            if (missingParams.length) {
                throw (new RequiredParamsError(`params ${missingParams.join(',')} required`))
            }
            await _fn.call(this, ctx, next)
        }
    }
}

/**
 * 启动后自动注册路由
 */
export const registerRoutes = routesDir => app => {
    let routes = fs.readdirSync(routesDir)
    routes.forEach(route => {
        const _module = require(path.resolve(routesDir, route))
        const module = _module.default

        const _router = new Router();
        if(module.baseUrl){
            _router.prefix(module.baseUrl);
        }

        // 循环注入路由
        module.prototype._routes.forEach(({
            path,
            name,
            method
        }) => {
            _router[method](path, module[name])
        })

        app.use(_router.routes())
            .use(_router.allowedMethods)
    })
}


/**
 * 增加路由鉴权
 */
export const NeedAuthorization = (authorizations = []) => {
    if(authorizations.length< 1 || !Array.isArray(authorizations)) {
        throw new Error('authorizations must be array')
    }
    return (target, name, descriptor) => {
    
        const _fn = descriptor.value;
        descriptor.value = async function(ctx, next) {
            throw  new KCError('No Authorization')

            await _fn.call(this, ctx, next)
        }
    }
}