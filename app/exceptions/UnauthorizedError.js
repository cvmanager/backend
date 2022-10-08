class UnauthorizedError extends Error {
    message = 'exceptions.no_authentication';
    constructor(message) {
        super(message);
        this.message = message;
    }
}

export default UnauthorizedError;