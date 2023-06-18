class NotFoundError extends Error {
    message = "errors.not_found";
    // status = 404;
    constructor(message) {
        super(message);
        if(message) this.message = message 

    }
} 

export default NotFoundError;