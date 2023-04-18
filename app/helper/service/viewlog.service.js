import autoBind from "auto-bind";

import Viewlog from "../../models/viewlog.model.js";
import ServiceBase from "./base.service.js";

class ViewlogService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }

    async setViewlog(entity, entityId, userId) {
        let data = {
            "entity": entity,
            "entity_id": entityId,
            "created_by": userId,
        }
        await Viewlog.create(data)
    }
}

export default new ViewlogService(Viewlog);