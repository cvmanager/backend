import autoBind from "auto-bind";
import FCMToken from "../../models/fcmToken.model.js";
import ServiceBase from "./base.service.js";

class FCMTokenService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }
}

export default new FCMTokenService(FCMToken);