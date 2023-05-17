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

    async getUserOwnPositions(userId) {
        let positions = await super.getAll({ user_id: userId, entity: 'positions', type: 'owner' })
        return positions.map(entity => entity.entity_id)
    }

    async getUserModeratorPositions(userId) {
        let positions = await super.getAll({ user_id: userId, entity: 'positions', type: 'moderator' })
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

    async getManagersIdOfCompany(company) {
        let companies = await super.getAll({ entity: 'companies', entity_id: company._id })
        return companies.map(company => company.user_id)
    }

    async getManagersIdOfProject(project) {
        let projects = await super.getAll({ entity: 'projects', entity_id: project._id })
        return projects.map(project => project.user_id)
    }

    async getManagersIdOfPosition(position) {
        let positions = await super.getAll({ entity: 'positions', entity_id: position._id })
        return positions.map(position => position.user_id)
    }
}

export default new ManagerService(Manager);
