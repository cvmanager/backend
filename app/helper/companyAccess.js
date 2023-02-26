import managerService from "./service/manager.service.js";
import ForbiddenError from "../exceptions/Forbidden.js";
import Company from "../models/company.model.js";


export async function companyAccess(req) {
    const companyId = req.params.id
    const document = await Company.findById(companyId).populate('created_by')
    if (!document) throw new NotFoundError(`company.errors.company_notfound`);

    if (!req.roles || req.roles.length === 0) return document

    for (let role of req.roles) {
        switch (role.name) {
            case 'System Manager':
                return document
            case 'Company Manager':
                const moderatorCompanies = await managerService.getUserModeratorCompanies(req.user._id)
                if (moderatorCompanies.some(company => company.equals(companyId))) return document
            case 'Owner':
                const ownCompanies = await managerService.getUserModeratorCompanies(req.user._id)
                if (ownCompanies.some(company => company.equals(companyId))) return document
            default:
                break;
        }
    }

    throw new ForbiddenError
}