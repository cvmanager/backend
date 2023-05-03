import autoBind from "auto-bind";

import Viewlog from "../../models/viewlog.model.js";
import ServiceBase from "./base.service.js";

class ViewlogService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }

    async setViewlog(entity, entity_id, req) {
        if (await this.allowSetViewlog(entity, entity_id)) {
            let data = {
                "entity": entity,
                "entity_id": entity_id,
                "created_by": req.user._id,
            }
            await this.create(data)
        }
    }

    async allowSetViewlog(entity, entityId, userId) {
        let setViewlogDurationInMinutes = 2
        let date = new Date()
        let viewlogDuration = date.setMinutes(date.getMinutes() - setViewlogDurationInMinutes)
        viewlogDuration = new Date(viewlogDuration)
        let lastViewlog = await this.findOne({ 'entity': entity, 'entity_id': entityId, 'created_by': userId, 'createdAt': { $gte: viewlogDuration } })

        return (lastViewlog == null) ? true : false
    }
}

export default new ViewlogService(Viewlog);