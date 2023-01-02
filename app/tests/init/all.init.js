import User from '../../models/user.model.js';
import Company from '../../models/company.model.js';
import Project from '../../models/project.model.js';
import Manager from '../../models/manager.model.js';
import Position from '../../models/position.model.js';
import Resume from '../../models/resume.model.js';
import { users, companies, projects, positions, managers, resumes } from '../data/data';
import bcrypt from 'bcrypt';

class AllInit {
    async setData() {
        this.salt = bcrypt.genSaltSync(10);
        await User.insertMany(users.map((user) => ({ ...user, password: bcrypt.hashSync(user.password, this.salt) })));
        await Company.insertMany(companies);
        await Project.insertMany(projects);
        await Position.insertMany(positions);
        await Resume.insertMany(resumes);
        await Manager.insertMany(managers);
    }
}

export default AllInit