import autoBind from "auto-bind";

import Permission from "../../models/permission.model.js";
import ServiceBase from "./base.service.js";


class PermissionService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }

}

export default new PermissionService(Permission);