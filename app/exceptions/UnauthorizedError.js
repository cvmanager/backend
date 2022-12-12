class UnauthorizedError extends Error {
    message = 'auth.errors.no_authentication';
    constructor(message) {
        super(message);
        if(message) this.message = message 

    }
}

export default UnauthorizedError;