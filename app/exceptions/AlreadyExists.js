class AlreadyCreated extends Error {
    message = "AlreaduCreated:((";
    // status = 404;
    constructor(message) {
        super(message);
        this.message = message;
    }
} 

export default AlreadyCreated;