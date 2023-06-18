class ManyRequestsError extends Error {
    message = "system.errors.too_many_requests";
    constructor(message) {
        super(message);
        if(message) this.message = message 
    }
} 

export default ManyRequestsError;