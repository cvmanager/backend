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
                },
                {
                    '$lookup': {
                        'from': 'permissions', 
                        'localField': 'permissions', 
                        'foreignField': '_id', 
                        'as': 'permissions'
                    }
                },
                {
                    '$addFields': {
                        'permissions': '$permissions.action'
                    }
                }
            ]
        )
    }

    async getAllRoles() {
        return this.model.aggregate(
            [
                {
                    '$lookup': {
                        'from': 'permissions', 
                        'localField': 'permissions', 
                        'foreignField': '_id', 
                        'as': 'permissions'
                    }
                },
                {
                    '$addFields': {
                        'permissions': '$permissions.action'
                    }
                }
            ]
        )
    }

    async rbac() {
        return this.model.aggregate([
            {
              '$lookup': {
                'from': 'users', 
                'localField': '_id', 
                'foreignField': 'role', 
                'as': 'users'
              }
            }, 
            {
              '$addFields': {
                'usersCount': {
                  '$size': '$users'
                }, 
                'users': {
                  '$slice': [
                    '$users', 0, 4
                  ]
                }
              }
            },
            {
               '$lookup': {
                'from': 'permissions', 
                'localField': 'permissions', 
                'foreignField': '_id', 
                'as': 'permissions'
              }
            }
          ])
    }
}

export default new RoleService(Role);
