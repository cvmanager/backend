class ManyRequestsError extends Error {
    message = "Too many requests, please try again later";
    constructor(message) {
        super(message);
        if(message) this.message = message 
    }
} 

export default ManyRequestsError;