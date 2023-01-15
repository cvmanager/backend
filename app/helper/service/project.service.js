
import Manager from '../../models/manager.model.js'


const addDefaultManagerForProject = async (project) => {
    await Manager.create({ user_id: project.created_by, entity: "projects", entity_id: project._id, created_by: project.created_by, type: "owner" });
}

const deleteManagersFromProject = async (project) => {
    let managers = await Manager.find({ 'entity': "projects", 'entity_id': project.id });
    managers.map((manager) => {
        manager.delete(project.deletedBy);
    })
}

export { addDefaultManagerForProject, deleteManagersFromProject }