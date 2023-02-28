import managerService from "../helper/service/manager.service.js";

export async function projectAccess(req, res, next) {
    let query = { $or: [] }

    if (!req.roles || req.roles.length === 0) query = {}

    for (let role of req.roles) {
        switch (role.name) {
            case 'System Manager':
                query.$or.push({})
                break;
            case 'Company Manager':
                const companyProjects = await managerService.getUserModeratorCompanies(req.user._id)
                query.$or.push({ company_id: { $in: companyProjects } })
                break;
            case 'Project Manager':
                const moderatorProjects = await managerService.getUserModeratorProjects(req.user._id)
                query.$or.push({ _id: { $in: moderatorProjects } })
                break;
            case 'Owner':
                const ownProjects = await managerService.getUserOwnProjects(req.user._id)
                query.$or.push({ company_id: { $in: ownProjects } })
                break;
            default:
                break;
        }
    }

    req.rbacQuery = query
    next()
}