import EventEmitter from '../emitter.js'

export const events = {
    "CREATE": "New Interview",
    "DELETE": "Delete Interview",
    "UPDATE": "Update Interview Info",
    "UPDATE_STATUS": "Update Interview Status",
}

EventEmitter.on(events.CREATE, create)
EventEmitter.on(events.DELETE, softdelete)
EventEmitter.on(events.UPDATE, update)
EventEmitter.on(events.UPDATE_STATUS, updateStatus)


function create(Interview) {
    console.log(events.DELETE + " event called", Interview)
}



function softdelete(Interview) {
    console.log(events.DELETE + " event called", Interview)
}


function update(Interview) {
    console.log(events.UPDATE + " event called", Interview)
}

function updateStatus(Interview) {
    console.log(events.UPDATE_STATUS + " event called", Interview)
}