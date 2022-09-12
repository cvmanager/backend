module.exports = class AppResponse {
    responseMessage = "";
    responseData;
    responseErrors;
    res;
    constructor(res) {
        this.res = res;
    }

    static builder(res) {
        return new AppResponse(res);
    }

    message(message) {
        this.responseMessage = message;
        return this;
    }

    data(data) {
        this.responseData = data;
        return this;
    }

    erros(erros) {
        this.responseErrors = erros;
        return this;
    }

    send() {
        let responseObject = {};
        if (this.responseMessage != "") {
            responseObject.message = this.responseMessage;
        }
        if (this.responseData) {
            responseObject.data = this.responseData;
        }

        if (this.responseErrors) {
            responseObject.erros = this.responseErrors;
        }
        this.res.send(responseObject);
    }
}