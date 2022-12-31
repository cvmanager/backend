import User from '../../models/user.model.js';
import Company from '../../models/company.model';
import Project from '../../models/project.model';
import Manager from '../../models/manager.model';
import { users, companies, projects, managers } from '../data/data';
import bcrypt from 'bcrypt';

class AllInit {
    setData() {
        this.salt = bcrypt.genSaltSync(10);
        User.insertMany(users.map((user) => ({ ...user, password: bcrypt.hashSync(user.password, this.salt) })));
        Company.insertMany(companies);
        Project.insertMany(projects);
        Manager.insertMany(managers);
    }
}

export default AllInit