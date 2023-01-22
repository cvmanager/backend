import EventEmitter from '../emitter.js'
import { addDefaultManagerForCompany, deleteManagersFromCompany } from '../../helper/service/company.service.js';

export const events = {
    "CREATE": "New Company",
    "DELETE": "Delete Company",
    "UPDATE": "Update Company Info",
    "SET_MANAGER": "Set New Manager For Company",
    "UNSET_MANAGER": "UnSet  Manager For Company"
}

EventEmitter.on(events.CREATE, create)
EventEmitter.on(events.DELETE, softdelete)
EventEmitter.on(events.UPDATE, update)
EventEmitter.on(events.SET_MANAGER, setManager)
EventEmitter.on(events.UNSET_MANAGER, unsetManager)


function create(Company) {
    addDefaultManagerForCompany(Company)
}


function softdelete(Company) {
    deleteManagersFromCompany(Company)
}


function update(Company) {
    console.log(events.UPDATE + " event called", Company)
}

function setManager(Company) {
    console.log(events.SET_MANAGER + " event called", Company)
}

function unsetManager(Company) {
    console.log(events.UNSET_MANAGER + " event called", Company)
}

