import { companies } from './data';
import Company from '../../models/company.model.js';
class CompanyData {
    getCompany() {
        return Object.values(companies)[0];
    }

    async setCompanies(companies) {
        await Company.insertMany(companies);
    }

    getCompanies() {
        return companies;
    }
 
    addCompany(company) {
        Company.insertMany(company);
    }
}

export default CompanyData