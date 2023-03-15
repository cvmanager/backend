import autoBind from "auto-bind";

import Position from "../../models/position.model.js";
import Manager from '../../models/manager.model.js';
import ServiceBase from "./base.service.js";


class PositionService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }

    async addDefaultManagerForPosition(position) {
        await Manager.create({ user_id: position.created_by, entity: "positions", entity_id: position._id, created_by: position.created_by, type: "owner" });
    }
    
    async deleteManagersFromPosition(position) {
        let managers = await Manager.find({ 'entity': "positions", 'entity_id': position.id });
        managers.map((manager) => {
            manager.delete(position.deletedBy);
        })
    }
}

export default new PositionService(Position);