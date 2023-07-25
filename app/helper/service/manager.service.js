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

    async getUserAllCompanies(userId) {
        let companies = await super.getAll({ user_id: userId, entity: 'companies' })
        return companies.map(entity => entity.entity_id)
    }

    async getUserOwnProjects(userId) {
        let companies = await super.getAll({ user_id: userId, entity: 'projects', type: 'owner' })
        return companies.map(entity => entity.entity_id)
    }

    async getUserModeratorProjects(userId) {
        return (await super.getAll({ user_id: userId, entity: 'projects', type: 'moderator' })).map(entity => entity.entity_id)
    }

    async getUserAllProjects(userId) {
        let companies = await super.getAll({ user_id: userId, entity: 'projects' })
        return companies.map(entity => entity.entity_id)
    }

    async getUserOwnPositions(userId) {
        let positions = await super.getAll({ user_id: userId, entity: 'positions', type: 'owner' })
        return positions.map(entity => entity.entity_id)
    }

    async getUserModeratorPositions(userId) {
        let positions = await super.getAll({ user_id: userId, entity: 'positions', type: 'moderator' })
        return positions.map(entity => entity.entity_id)
    }

    async getUserAllPositions(userId) {
        let positions = await super.getAll({ user_id: userId, entity: 'positions' })
        return positions.map(entity => entity.entity_id)
    }

    async deleteManagersFromCompany(company) {
        let managers = await super.getAll({ 'entity': "companies", 'entity_id': company.id });
        managers.map((manager) => {
            manager.delete(company.deletedBy);
        })
    }

    async addDefaultManagerForCompany(company) {
        await super.create({ user_id: company.created_by, entity: "companies", entity_id: company._id, created_by: company.created_by, type: "owner" });
    }

    async getManagersIdByEntity(entity, entity_id) {
        let managers = await super.getAll({ 'entity': entity, 'entity_id': entity_id });
        return managers.map(entity => entity.user_id)
    }
}

export default new ManagerService(Manager);
