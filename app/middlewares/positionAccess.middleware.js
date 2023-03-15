import managerService from "../helper/service/manager.service.js";

export async function positionAccess(req, res, next) {
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
                query.$or.push({ project_id: { $in: moderatorProjects } })
                break;
            case 'Position Manager':
                const moderatorPositions = await managerService.getUserModeratorPositions(req.user._id)
                query.$or.push({ project_id: { $in: moderatorPositions } })
                break;
            case 'Owner':
                const ownPositions = await managerService.getUserOwnPositions(req.user._id)
                query.$or.push({ _id: { $in: ownPositions } })
                const ownCompanies = await managerService.getUserOwnCompanies(req.user._id)
                query.$or.push({ company_id: { $in: ownCompanies } })
                break;
            default:
                break;
        }
    }

    req.rbacQuery = query
    next()
}