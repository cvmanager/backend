import EventEmitter from '../emitter.js'

export const companyEvents = {
    "CREATE": "New Company",
    "DELETE": "Delete Company",
    "UPDATE": "Update Company Info",
    "SET_MANAGER": "Set New Manager For Company",
    "UNSET_MANAGER": "UnSet  Manager For Company"
}

EventEmitter.on(companyEvents.CREATE, create)
EventEmitter.on(companyEvents.DELETE, softdelet)
EventEmitter.on(companyEvents.UPDATE, update)
EventEmitter.on(companyEvents.SET_MANAGER, setManager)
EventEmitter.on(companyEvents.UNSET_MANAGER, unsetManager)


function create(Company) {
    console.log(companyEvents.DELETE + " event called", Company)
}


function softdelet(Company) {
    console.log(companyEvents.DELETE + " event called", Company)
}


function update(Company) {
    console.log(companyEvents.UPDATE + " event called", Company)
}

function setManager(Company) {
    console.log(companyEvents.SET_MANAGER + " event called", Company)
}

function unsetManager(Company) {
    console.log(companyEvents.UNSET_MANAGER + " event called", Company)
}

