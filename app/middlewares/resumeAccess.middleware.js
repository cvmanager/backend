import managerService from "../helper/service/manager.service.js";

export async function resumeAccess(req, res, next) {
    let query = { $or: [] }

    if (!req.roles || req.roles.length === 0) query = {}

    for (let role of req.roles) {
        switch (role.name) {
            case 'System Manager':
                query.$or.push({})
                break;
            case 'Company Manager':
                const companyProjects = await managerService.getUserModeratorCompanies(req.user.id)
                query.$or.push({ company_id: { $in: companyProjects } })
                break;
            case 'Project Manager':
                const moderatorProjects = await managerService.getUserModeratorProjects(req.user.id)
                query.$or.push({ project_id: { $in: moderatorProjects } })
                break;
            case 'Position Manager':
                const moderatorPositions = await managerService.getUserModeratorPositions(req.user.id)
                query.$or.push({ position_id: { $in: moderatorPositions } })
                break;
            case 'Owner':
                query.$or.push({ created_by: req.user.id })
                const userPositions = await managerService.getUserAllPositions(req.user.id)
                query.$or.push({ position_id: { $in: userPositions } })
                const userProjects = await managerService.getUserAllProjects(req.user.id)
                query.$or.push({ project_id: { $in: userProjects } })
                const userCompanies = await managerService.getUserAllCompanies(req.user.id)
                query.$or.push({ company_id: { $in: userCompanies } })
                break;
            default:
                break;
        }
    }

    req.rbacQuery = query
    next()
}