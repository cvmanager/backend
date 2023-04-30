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

    async addCountOfTag(tag) {
        tag.count = ++tag.count;
        tag.save();
    }

    async checkAndReturnTag(name) {
        let tag = await this.findOne({ name: name });
        if (tag) {
            await this.addCountOfTag(tag)
            return tag;
        }

        tag = await this.create({ 'name': name, 'color': getRandomColor() });
        return tag;
    }
}

export default new TagService(Tag);