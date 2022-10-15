class NotFoundError extends Error {
    message = "NotFound:((";
    // status = 404;
    constructor(message) {
        super(message);
        if(message) this.message = message 

    }
} 

export default NotFoundError;