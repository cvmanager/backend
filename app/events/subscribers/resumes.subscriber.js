import EventEmitter from '../emitter.js'

export const resumeEvents = {
    "CREATE": "New Resume",
    "DELETE": "Delete Resume",
    "UPDATE": "Update Resume Info",
    "UPDATE_STATUS": "Update Resume Status",
}

EventEmitter.on(resumeEvents.CREATE, create)
EventEmitter.on(resumeEvents.DELETE, softdelet)
EventEmitter.on(resumeEvents.UPDATE, update)
EventEmitter.on(resumeEvents.UPDATE_STATUS, updateStatus)


function create(Resume) {
    console.log(resumeEvents.DELETE + " event called", Resume)
}



function softdelet(Resume) {
    console.log(resumeEvents.DELETE + " event called", Resume)
}


function update(Resume) {
    console.log(resumeEvents.UPDATE + " event called", Resume)
}

function updateStatus(Resume) {
    console.log(resumeEvents.UPDATE_STATUS + " event called", Resume)
}