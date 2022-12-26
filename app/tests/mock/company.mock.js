// import Repository from './index';
import { users, companies } from './data';
import Company from '../../models/Company.model.js';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import env from '../../helper/env.js';

class CompanyMock {
    company = {};
    companies;
    salt;

    constructor() {
        this.salt = bcrypt.genSaltSync(10);
        Company.insertMany(companies.map((company) => (company)));
        this.companies = companies;
        this.company = Object.values(companies)[0];
    }

    index() {
        return this.companies = companies;
    }

    set(companies) {
        Company.insertMany(companies.map((company) => (company)));
    }

    get() {
        return this.company = Object.values(companies)[0];
    }

}

export default CompanyMock