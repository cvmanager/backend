
import Manager from '../../models/manager.model.js'


export const addDefaultManagerForPosition = async (position) => {
    await Manager.create({ user_id: position.created_by, entity: "positions", entity_id: position._id, created_by: position.created_by, type: "owner" });
}

export const deleteManagersFromPosition = async (position) => {
    let managers = await Manager.find({ 'entity': "positions", 'entity_id': position.id });
    managers.map((manager) => {
        manager.delete(position.deletedBy);
    })
}