import User from '../../models/user.model.js';
import Company from '../../models/company.model.js';
import Project from '../../models/project.model.js';
import Manager from '../../models/manager.model.js';
import Position from '../../models/position.model.js';
import LogHistory from '../../models/loginLog.model.js';
import Resume from '../../models/resume.model.js';
import ResumeComment from '../../models/resumeComment.model';
import Interview from '../../models/interview.model.js';
import { users, companies, projects, positions, managers, resumes, resumeComments, interviews, logHistory } from '../data/data';
import bcrypt from 'bcrypt';
import { fillProvinceTable } from "../../helper/service/province.service"
import roleService from "../../helper/service/role.service.js";
import userService from "../../helper/service/user.service.js";
import rbacConfig, { createPermissions } from '../../helper/rbac.js';
import app from '../../app.js'

class AllInit {
    async setData() {
        this.salt = bcrypt.genSaltSync(10);
        await User.insertMany(users.map((user) => ({ ...user, password: bcrypt.hashSync(user.password, this.salt) })));
        await Company.insertMany(companies);
        await LogHistory.insertMany(logHistory);
        await Project.insertMany(projects);
        await Position.insertMany(positions);
        await Resume.insertMany(resumes);
        await ResumeComment.insertMany(resumeComments);
        await Manager.insertMany(managers);
        await Interview.insertMany(interviews);
        await fillProvinceTable();
        await createPermissions(app)
        // await rbacConfig()
        await roleService.fillRoles();
        await userService.fillUsers();
    }
}

export default AllInit