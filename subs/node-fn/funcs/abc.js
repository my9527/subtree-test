
import test from './test';
// import { resolve } from 'any-promise';

function sleep() {
    return new Promise(resolve => {
        setTimeout(resolve, 3500);
    })
}

export default async function sdf(args)    {
    const {
        a, b ,c
    } = args;

    const aa = await test({ a , b })
    await sleep();
    console.log(aa);
    return a + b + 2 * c + aa;
}