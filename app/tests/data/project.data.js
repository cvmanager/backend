import { projects } from './data';
import Project from '../../models/project.model.js';
class ProjectData {
    getProject() {
        return Object.values(projects)[0];
    }

    async setProjects(projects){
        await Project.insertMany(projects);
    }

    getProjects() {
        return projects;
    }
}

export default ProjectData