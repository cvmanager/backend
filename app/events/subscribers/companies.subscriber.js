import EventEmitter from '../emitter.js'
import managerService from '../../helper/service/manager.service.js';
import viewlogService from '../../helper/service/viewlog.service.js'

export const CompanyEvents = {
    "FIND": "Find Company",
    "CREATE": "New Company",
    "DELETE": "Delete Company",
    "UPDATE": "Update Company Info",
    "SET_MANAGER": "Set New Manager For Company",
    "UNSET_MANAGER": "UnSet  Manager For Company",
    "ACTIVE_COMPANY": "event after active company",
    "DEACTIVE_COMPANY": "event after deactive company"
}

EventEmitter.on(CompanyEvents.FIND, find)
EventEmitter.on(CompanyEvents.CREATE, create)
EventEmitter.on(CompanyEvents.DELETE, softdelete)
EventEmitter.on(CompanyEvents.UPDATE, update)
EventEmitter.on(CompanyEvents.SET_MANAGER, setManager)
EventEmitter.on(CompanyEvents.UNSET_MANAGER, unsetManager)
EventEmitter.on(CompanyEvents.ACTIVE_COMPANY, active)
EventEmitter.on(CompanyEvents.DEACTIVE_COMPANY, deActive)

async function find(Company, req) {
    await viewlogService.setViewlog('companies', Company._id, req)
}
function active(Company, req) {
    console.log(CompanyEvents.ACTIVE_COMPANY + " event called", Company)
}

function deActive(Company, req) {
    console.log(CompanyEvents.DEACTIVE_COMPANY + " event called", Company)
}

function create(Company, req) {
    managerService.addDefaultManagerForCompany(Company)
}

function softdelete(Company, req) {
    managerService.deleteManagersFromCompany(Company)
}


function update(Company, req) {
    console.log(CompanyEvents.UPDATE + " event called", Company)
}

function setManager(Company, req) {
    console.log(CompanyEvents.SET_MANAGER + " event called", Company)
}

function unsetManager(Company, req) {
    console.log(CompanyEvents.UNSET_MANAGER + " event called", Company)
}

