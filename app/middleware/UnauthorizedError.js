class UnauthorizedError extends Error {
    message = 'No authentication';
    constructor(message) {
        super(message);
        this.message = message;
    }
}

module.exports = UnauthorizedError;