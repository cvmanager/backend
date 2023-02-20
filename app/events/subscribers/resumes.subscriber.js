import EventEmitter from '../emitter.js'
import { setProccessDuration } from '../../helper/service/resume.service.js';

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
    setProccessDuration(Resume)
}