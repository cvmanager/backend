import autoBind from "auto-bind";

import Company from "../../models/company.model.js";
import ServiceBase from "./base.service.js";
import managerService from "./manager.service.js";


class CompanyService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }

    async isCompanyDouplicate(filter = {}, user, companyId = null) {

        let companies = await managerService.getUserAllCompanies(user._id)
        if (companies.length == 0) return false;

        if(companyId) companies.splice(companies.indexOf(companyId), 1);
        let company = await this.findOne({ ...filter, '_id': { $in: companies } });
        if (!company) return false;

        return true
    }
}

export default new CompanyService(Company);