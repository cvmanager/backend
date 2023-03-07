import autoBind from "auto-bind";

import Company from "../../models/company.model.js";
import ServiceBase from "./base.service.js";


class CompanyService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }
}

export default new CompanyService(Company);