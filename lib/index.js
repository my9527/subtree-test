
import fs from 'fs';
import path from 'path'


// 函数执行器
export const funcsHanlder = async (ctx, next) => {
   const { params, reqParams } = ctx;

    const _fnName = params.fnName;
    const _args = reqParams;

    const fn = await loadFn(_fnName);
    let result = null
    try {
        result = await runCloudFunc(fn, _args);   
    }  catch(e){
        // console.log('eee', e)
        result = e;
        ctx.status = 500;
    }

    ctx.body = result;
}


// 函数保存
export const funcsSaver = async (ctx, next) => {

}


// function _readFnFile(fnName) {
//     // const file = fs.createReadStream(path.resolve(__dirname, `../funcs/${fnName}.js`));

// }

async function loadFn(fnName) {
    try {
         // 增加缓存，不用每次都去读取，同时缓存需要在一定未使用时间后自动删除，避免内存浪费
        return require(path.resolve(__dirname, `../funcs/${fnName}.js`)).default;
    } catch(e) {
        return `function ${fnName} not found`;
    }
}

async function runCloudFunc(fn, params) {
    if(typeof fn !== 'function') {
        return `${fn}`;
    }
    return new Promise(async (resolve, reject) => {
        setTimeout(()=> {
            reject(new Error('timeout'))
        }, 3000);
        try{
            const result = await fn.call(null, params);
            resolve(result)
        } catch(e){
            reject(e);
        }
    })
}