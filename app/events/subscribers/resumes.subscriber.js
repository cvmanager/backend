import EventEmitter from '../emitter.js'

export const resumeEvents = {
    "CREATE": "New Resume",
    "DELETE": "Delete Resume",
    "UPDATE": "Update Resume Info",
    "UPDATE_STATUS": "Update Resume Status",
}

EventEmitter.on(resumeEvents.CREATE, create)
EventEmitter.on(resumeEvents.DELETE, softdelet)
EventEmitter.on(resumeEvents.UPDATE, UpdateStatus)
EventEmitter.on(resumeEvents.UPDATE_STATUS, UpdateStatus)


function create(resume) {
    console.log(resumeEvents.DELETE + " event called", resume)
}



function softdelet(resume) {
    console.log(resumeEvents.DELETE + " event called", resume)
}


function update(resume) {
    console.log(resumeEvents.UPDATE + " event called", resume)
}

function UpdateStatus(resume) {
    console.log(resumeEvents.UPDATE_STATUS + " event called", resume)
}