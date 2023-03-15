import autoBind from "auto-bind";

import Manager from '../../models/manager.model.js';
import Project from "../../models/project.model.js";
import ServiceBase from "./base.service.js";


class ProjectService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }

    async addDefaultManagerForProject(project) {
        await Manager.create({ user_id: project.created_by, entity: "projects", entity_id: project._id, created_by: project.created_by, type: "owner" });
    }
    
    async deleteManagersFromProject(project) {
        let managers = await Manager.find({ 'entity': "projects", 'entity_id': project.id });
        managers.map((manager) => {
            manager.delete(project.deletedBy);
        })
    }
}

export default new ProjectService(Project);