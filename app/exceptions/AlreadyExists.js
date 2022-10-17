class AlreadyExists extends Error {
    message = "error.already_exists";
    constructor(message) {
        super(message);
        if(message) this.message = message 

    }
} 

export default AlreadyExists;