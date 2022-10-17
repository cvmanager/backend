class BadRequestError extends Error {
    message = "error.bad_request";
    // status = 404;
    constructor(message, validationErr = []) {
        super(message);
        if(message) this.message = message 

        this.errors = validationErr;
    }
}

export default BadRequestError;