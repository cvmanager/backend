import User from '../../models/user.model.js';
import Company from '../../models/company.model.js';
import Project from '../../models/project.model.js';
import Manager from '../../models/manager.model.js';
import Position from '../../models/position.model.js';
import Resume from '../../models/resume.model.js';
import ResumeComment from '../../models/resumeComment.model';
import { users, companies, projects, positions, managers, resumes, resumeComments } from '../data/data';
import bcrypt from 'bcrypt';
import { fillProvinceTable } from "../../helper/service/province.service"

class AllInit {
    async setData() {
        this.salt = bcrypt.genSaltSync(10);
        await User.insertMany(users.map((user) => ({ ...user, password: bcrypt.hashSync(user.password, this.salt) })));
        await Company.insertMany(companies);
        await Project.insertMany(projects);
        await Position.insertMany(positions);
        await Resume.insertMany(resumes);
        await ResumeComment.insertMany(resumeComments);
        await Manager.insertMany(managers);
        await fillProvinceTable();

    }
}

export default AllInit