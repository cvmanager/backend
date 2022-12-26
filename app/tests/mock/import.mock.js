// import Repository from './index';
import { users, companies, projects ,managers } from './data';
import User from '../../models/user.model.js';
import Company from '../../models/company.model.js';
import Project from '../../models/project.model.js';
import Manager from '../../models/manager.model.js';

import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import env from '../../helper/env.js';

class ImportMock {
    user = {};
    users;
    company = {};
    companies;
    project = {};
    projects;
    manager = {};
    managers;
    token;
    salt;

    constructor() {
        this.salt = bcrypt.genSaltSync(10);
        User.insertMany(users.map((user) => ({ ...user, password: bcrypt.hashSync(user.password, this.salt) })));
        Company.insertMany(companies.map((company) => (company)));
        Project.insertMany(projects.map((project) => (project)));
        Manager.insertMany(managers.map((manager) => (manager)));

        this.users = users;
        this.user = Object.values(users)[0];
        this.companies = companies;
        this.company = Object.values(companies)[0];
        this.projects = projects;
        this.project = Object.values(projects)[0];
        this.managers = managers;
        this.manager = Object.values(managers)[0];
    }

    accessToken() {
        return 'Bearer ' + jsonwebtoken.sign({ sub: this.user._id, }, env("JWT_SECRET_TOKEN"), {
            expiresIn: env("JWT_EXPIRATION_TIME_TOKEN")
        });
    };



}

export default ImportMock