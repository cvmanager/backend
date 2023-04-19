import EventEmitter from '../emitter.js'
import resumeService from '../../helper/service/resume.service.js'

export const events = {
    "CREATE": "New Interview",
    "DELETE": "Delete Interview",
    "UPDATE": "Update Interview Info",
}

EventEmitter.on(events.CREATE, create)
EventEmitter.on(events.DELETE, softdelete)
EventEmitter.on(events.UPDATE, update)


async function create(Interview) {
    let resume = await resumeService.findOne({ '_id': Interview.resume_id })
    await resumeService.updateRating(resume)
}



function softdelete(Interview) {
    console.log(events.DELETE + " event called", Interview)
}


async function update(Interview) {
    let resume = await resumeService.findOne({ '_id': Interview.resume_id })
    await resumeService.updateRating(resume)
}
