import EventEmitter from '../emitter.js'
import resumeService from '../../helper/service/resume.service.js'

export const ResumesInterviewEvents = {
    "CREATE": "New Interview",
    "DELETE": "Delete Interview",
    "UPDATE": "Update Interview Info",
}

EventEmitter.on(ResumesInterviewEvents.CREATE, create)
EventEmitter.on(ResumesInterviewEvents.DELETE, softdelete)
EventEmitter.on(ResumesInterviewEvents.UPDATE, update)


async function create(Interview,req) {
    let resume = await resumeService.findOne({ '_id': Interview.resume_id })
    await resumeService.updateRating(resume)
}



function softdelete(Interview,req) {
    console.log(ResumesInterviewEvents.DELETE + " event called", Interview)
}


async function update(Interview,req) {
    let resume = await resumeService.findOne({ '_id': Interview.resume_id })
    await resumeService.updateRating(resume)
}
