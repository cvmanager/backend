import autoBind from "auto-bind";

import Permission from "../../models/permission.model.js";
import ServiceBase from "./base.service.js";


class PermissionService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }

    async getPermissions () {
        return this.model.aggregate([
            {
                '$group': {
                    '_id': '$entity', 
                    'permissions': {
                        '$push': '$$ROOT'
                    }
                }
            }, 
            {
                '$project': {
                    'entity': '$_id',
                    '_id': 0, 
                    'permissions': 1
                }
            }
        ])
    }

}

export default new PermissionService(Permission);