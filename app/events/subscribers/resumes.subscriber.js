import EventEmitter from '../emitter.js'

export const events = {
    "CREATE": "New Resume",
    "DELETE": "Delete Resume",
    "UPDATE": "Update Resume Info",
    "UPDATE_STATUS": "Update Resume Status",
}

EventEmitter.on(events.CREATE, create)
EventEmitter.on(events.DELETE, softdelete)
EventEmitter.on(events.UPDATE, update)
EventEmitter.on(events.UPDATE_STATUS, updateStatus)


function create(Resume) {
    console.log(events.DELETE + " event called", Resume)
}



function softdelete(Resume) {
    console.log(events.DELETE + " event called", Resume)
}


function update(Resume) {
    console.log(events.UPDATE + " event called", Resume)
}

function updateStatus(Resume) {
    console.log(events.UPDATE_STATUS + " event called", Resume)
}