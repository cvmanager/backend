class UnauthorizedError extends Error {
    message = 'auth.error.no_authentication';
    constructor(message) {
        super(message);
        if(message) this.message = message 

    }
}

export default UnauthorizedError;