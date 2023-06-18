import autoBind from "auto-bind";

import Tag from "../../models/tag.model.js";
import ServiceBase from "./base.service.js";
import { getRandomColor } from '../helper.js';

class TagService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }

    async addCountTagUse(tag) {
        tag.count = ++tag.count;
        tag.save();
    }
}

export default new TagService(Tag);