const validator = (...args: any[]) => {
    let flag = true;
    for (let i of args) {
        if(i.length === 0) flag = false;
    }
    return flag;
}
export default validator
