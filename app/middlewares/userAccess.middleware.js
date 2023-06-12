import managerService from "../helper/service/manager.service.js";

export async function userAccess(req, res, next) {
    let query = { $or: [{}] }

    if (!req.roles || req.roles.length === 0) query = {}

    for (let role of req.roles) {
        switch (role.name) {
            case 'System Manager':
                query.$or.push({})
                break;
            default:
                break;
        }
    }

    req.rbacQuery = query
    next()
}