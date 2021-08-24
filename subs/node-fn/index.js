
import Koa from 'koa'
import path from 'path'
// import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import paramsHandle from './Utils/Middlewares/paramHandle'
import formatResponse from './Utils/Middlewares/formateResponse'
import Router from 'koa-router';

import {
    funcsHanlder,
    funcsSaver,
} from './lib/index'

/**
 * 
 * 启动一个服务器，并配置一个路由用于客户端请求，该请求包含了将要运行的函数以及传递的参数，运行后返回相应的执行结果，
 * 如果3s 没有执行完成，那么自动超时，向客户端返回超时
 * 
 */

async function main () {

    const app = new Koa();

    

    app.use(bodyParser())

    app.use(paramsHandle);
    app.use(formatResponse);

    // 处理跨域操作
    app.use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET,OPTIONS');
        ctx.set('Access-Control-Max-Age', 3600 * 24);
        await next();
    });

    const router = new Router();


    // router.use('*', paramsHandle);


    router.get('/', async(ctx, next)=> {
        ctx.body = 'welcome to node-cloud';
    });

    router.post('/funcs/apply/:fnName', funcsHanlder)
    router.post('/funcs/save', funcsSaver)


    app.use(router.routes());
    app.use(router.allowedMethods());

    app.listen(9000)

}

main();