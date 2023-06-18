class NoContentError extends Error {
    message = "resume.errors.no_content";
    // status = 204;
    constructor(message) {
        super(message);
        if(message) this.message = message 
    }
} 

export default NoContentError;