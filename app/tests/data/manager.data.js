import { managers } from './data';

class ManagerData {
    getManager() {
        return Object.values(managers)[0];
    }

    getManagers() {
        return managers;
    }

    getManagerByEntity(entity) {
        return managers.find(manager => manager.entity == entity);
    }

    getManagerByEntityId(entityId) {
        return managers.find(manager => manager.entity_id == entityId);
    }
}

export default ManagerData