import managerService from "../helper/service/manager.service.js";

export async function companyAccess(req, res, next) {
    let query = { $or: [] }

    if (!req.roles || req.roles.length === 0) query = {}

    for (let role of req.roles) {
        switch (role.name) {
            case 'System Manager':
                query.$or.push({})
                break;
            case 'Company Manager':
                const moderatorCompanies = await managerService.getUserModeratorCompanies(req.user.id)
                query.$or.push({ _id: { $in: moderatorCompanies } })
                break;
            case 'Owner':
                const userCompanies = await managerService.getUserAllCompanies(req.user.id)
                query.$or.push({ _id: { $in: userCompanies } })
                break;
            default:
                break;
        }
    }

    req.rbacQuery = query
    next()
}