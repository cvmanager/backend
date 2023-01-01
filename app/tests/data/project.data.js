import { projects } from './data';

class ProjectData {
    getProject() {
        return Object.values(projects)[0];
    }

    getProjects() {
        return projects;
    }
}

export default ProjectData