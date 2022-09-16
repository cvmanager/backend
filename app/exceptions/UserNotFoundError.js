class UserNotFoundError extends Error {
    message = "User Not Found";
    // status = 404;
    constructor(message, validationErr = []) {
        super(message);
        this.message = message;
        this.errors = validationErr;
    }
}

module.exports = UserNotFoundError;