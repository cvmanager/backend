
import Manager from '../../models/manager.model.js'


export const addDefaultManagerForCompany = async (company) => {
    await Manager.create({ user_id: company.created_by, entity: "companies", entity_id: company._id, created_by: company.created_by, type: "owner" });
}

export const deleteManagersFromCompany = async (company) => {
    let managers = await Manager.find({ 'entity': "companies", 'entity_id': company.id });
    managers.map((manager) => {
        manager.delete(company.deletedBy);
    })
}