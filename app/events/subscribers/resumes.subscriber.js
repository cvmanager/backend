import EventEmitter from '../emitter.js'

export const resumeEvents = {
    "NEW_RESUME": "NEW_RESUME"
}

EventEmitter.on(resumeEvents.NEW_RESUME, newResume)


function newResume (resume) {
    console.log(resumeEvents.NEW_RESUME + " event called", resume)
}