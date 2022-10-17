class ManyRequestsError extends Error {
    message = "error.too_many_requests";
    constructor(message) {
        super(message);
        if(message) this.message = message 
    }
} 

export default ManyRequestsError;