import { projects } from './data';
import Project from '../../models/project.model.js';
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
class ProjectData {
    getProject() {
        return Object.values(projects)[0];
    }

    async setProjects(projects) {
        await Project.insertMany(projects);
    }

    getProjects() {
        return projects;
    }

    addProject(project) {
        Project.insertMany(project);
    }

    async setDeActiveData() {
        let project = {
            "_id": Types.ObjectId(),
            "company_id": Types.ObjectId(),
            "is_active": false,
            "name": faker.random.alpha(10),
            "description": faker.random.alpha(50),
            "created_by": Types.ObjectId()
        }

        await this.setProjects([project]);
        return project
    }
}

export default ProjectData