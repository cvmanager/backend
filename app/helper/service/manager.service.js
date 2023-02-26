import autoBind from "auto-bind";
import Manager from "../../models/manager.model.js";
import ServiceBase from "./base.service.js";


class ManagerService extends ServiceBase {
    constructor(model) {
        super(model)
        this.model = model
        autoBind(this)
    }
    
    async getUserOwnCompanies(userId) {
        let companies = await super.getAll({ user_id: userId, entity: 'companies', type: 'owner' })
        return companies.map(entity => entity.entity_id)
    }

    async getUserModeratorCompanies(userId) {
        return (await super.getAll({ user_id: userId, entity: 'companies', type: 'moderator' })).map(entity => entity.entity_id)
    }

    async getUserOwnProjects(userId) {
        let companies = await super.getAll({ user_id: userId, entity: 'projects', type: 'owner' })
        return companies.map(entity => entity.entity_id)
    }

    async getUserModeratorProjects(userId) {
        return (await super.getAll({ user_id: userId, entity: 'projects', type: 'moderator' })).map(entity => entity.entity_id)
    }
}

export default new ManagerService(Manager);
