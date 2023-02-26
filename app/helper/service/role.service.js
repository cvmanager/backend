import autoBind from "auto-bind";

import Role from "../../models/role.model.js";
import ServiceBase from "./base.service.js";

class RoleService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }
    
    async getRolesWithChilds() {
        return this.model.aggregate(
            [
                {
                    '$graphLookup': {
                        'from': 'roles', 
                        'startWith': '$_id', 
                        'connectFromField': '_id', 
                        'connectToField': 'parent', 
                        'as': 'childs'
                    }
                }
            ]
        )
    }
}

export default new RoleService(Role);
