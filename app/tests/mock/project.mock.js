// import Repository from './index';
import { users, companies, projects } from './data';
import Project from '../../models/Project.model.js';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import env from '../../helper/env.js';

class ProjectMock {
    project = {};
    projects;
    salt;

    constructor() {
        this.salt = bcrypt.genSaltSync(10);
        Project.insertMany(projects.map((project) => (project)));
        this.projects = projects;
        this.project = Object.values(projects)[0];
    }

    index() {
        return this.projects = projects;
    }

    set(projects) {
        Project.insertMany(projects.map((project) => (project)));
    }

    get() {
        return this.project = Object.values(projects)[0];
    }

}

export default ProjectMock