import { companies } from './data';

class CompanyData {
    getCompany() {
        return Object.values(companies)[0];
    }

    getCompanies() {
        return companies;
    }
}

export default CompanyData