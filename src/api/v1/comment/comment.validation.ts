const validationResult = (comment:string) => {
    let error = false;
    if (comment.length === 0) error = true;
    return error
}
export default validationResult