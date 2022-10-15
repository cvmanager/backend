class BadRequestError extends Error {
    message = "BadRequest:((";
    // status = 404;
    constructor(message, validationErr = []) {
        super(message);
        if(message) this.message = message 

        this.errors = validationErr;
    }
}

export default BadRequestError;