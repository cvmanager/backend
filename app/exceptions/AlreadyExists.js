class AlreadyExists extends Error {
    message = "AlreaduCreated:((";
    // status = 404;
    constructor(message) {
        super(message);
        if(message) this.message = message 

    }
} 

export default AlreadyExists;