class AlreadyExists extends Error {
    message = "system.errors.already_exists";
    constructor(message) {
        super(message);
        if(message) this.message = message 

    }
} 

export default AlreadyExists;