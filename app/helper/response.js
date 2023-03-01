class AppResponse {
    responseMessage = "Successfuly";
    responseData = [];
    responseErrors = [];
    responseStatus = 200;
    res;
    constructor(res) {
        this.res = res;
    }

    static builder(res) {
        return new AppResponse(res);
    }

    message(message) {
        this.responseMessage = this.res.__("translate." + message);
        return this;
    }

    data(data) {
        data = Array.isArray(data) ? data : [data]
        this.responseData = data;
        return this;
    }

    status(status) {
        this.responseStatus = status;
        return this;
    }

    erros(erros) {
        this.responseErrors = erros;
        return this;
    }

    send() {
        this.res.status(this.responseStatus).send({
            'message': this.responseMessage,
            'data': this.responseData,
            'erros': this.responseErrors,
        });
    }
}

export default AppResponse