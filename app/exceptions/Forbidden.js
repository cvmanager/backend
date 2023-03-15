class ForbiddenError extends Error {
    message = "auth.errors.forbidden_access";
    constructor(message) {
        super(message);
        if(message) this.message = message 
    }
} 

export default ForbiddenError;