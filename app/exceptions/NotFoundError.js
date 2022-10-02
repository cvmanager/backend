class NotFoundError extends Error {
    message = "NotFound:((";
    // status = 404;
    constructor(message) {
        super(message);
        this.message = message;
    }
} 

export default NotFoundError;