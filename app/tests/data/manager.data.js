import { managers } from './data';

class ManagerData {
    getManager() {
        return Object.values(managers)[0];
    }

    getManagers() {
        return managers;
    }
}

export default ManagerData