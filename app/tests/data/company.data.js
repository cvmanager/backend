import { companies } from './data';
import Company from '../../models/company.model.js';
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
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

    async setDeActiveData() {
        let company = {
            "_id": Types.ObjectId(),
            "name": faker.company.name(),
            "description": faker.random.alpha(50),
            "phone": faker.phone.number('989#########'),
            "address": faker.random.alpha(100),
            "created_by": Types.ObjectId()
        }

        await this.setCompanies([company]);
        return company
    }
}

export default CompanyData