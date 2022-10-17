class UserNotFoundError extends Error {
    message = "user.error.user_notfound";
    constructor(message, validationErr = []) {
        super(message);
        if(message) this.message = message 
        this.errors = validationErr;
    }
}

export default UserNotFoundError;