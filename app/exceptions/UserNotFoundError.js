class UserNotFoundError extends Error {
    message = "user not found";
    constructor(message, validationErr = []) {
        super(message);
        if(message) this.message = message 
        this.errors = validationErr;
    }
}

module.exports = UserNotFoundError;