

export default  async function test(args) {
    const {
        a,
        b,
    } = args;
    console.log(a, b);
    // throw new Error('sdf')
    return a/b;
}

