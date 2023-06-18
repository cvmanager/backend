import autoBind from "auto-bind";
import Skill from "../../models/skill.model.js";
import ServiceBase from "./base.service.js";

class SkillService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }
}

export default new SkillService(Skill);