import autoBind from "auto-bind";

import Permission from "../../models/permission.model.js";
import ServiceBase from "./base.service.js";


class PermissionService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }

    async addRole(permissionId, roleId) {
        return Permission.findOneAndUpdate({ _id: permissionId }, { $addToSet: { roles: roleId } })
    }

    async removeRole(permissionId, roleId) {
        return Permission.findOneAndUpdate({ _id: permissionId }, { $pull: { roles: roleId } })
    }

}

export default new PermissionService(Permission);