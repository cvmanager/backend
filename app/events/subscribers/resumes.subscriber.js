import resumeService from '../../helper/service/resume.service.js'
import viewlogService from '../../helper/service/viewlog.service.js'
import EventEmitter from '../emitter.js'
export const events = {
    "FIND": "Find Resume",
    "CREATE": "New Resume",
    "DELETE": "Delete Resume",
    "UPDATE": "Update Resume Info",
    "UPDATE_STATUS": "Update Resume Status",
    "ADD_COMMENT": "add comment for resume",
    "ADD_CALL_HISTORY": "add call history for resume",
    "ADD_FILE": "add file to resume",
    "ADD_TAG": "add tag to resume",
}

EventEmitter.on(events.FIND, find)
EventEmitter.on(events.CREATE, create)
EventEmitter.on(events.DELETE, softdelete)
EventEmitter.on(events.UPDATE, update)
EventEmitter.on(events.UPDATE_STATUS, updateStatus)
EventEmitter.on(events.ADD_COMMENT, addComment)
EventEmitter.on(events.ADD_CALL_HISTORY, addCallHistory)
EventEmitter.on(events.ADD_FILE, addFile)
EventEmitter.on(events.ADD_TAG, addTag)

async function find(Resume) {
    await viewlogService.setViewlog('resume', Resume._id, Resume.created_by)
    let viewlogCount = await resumeService.getResumeViewCount(Resume);
    await resumeService.updateSummeryCount(Resume, 'view', viewlogCount)
}

async function create(Resume) {
    await resumeService.fillIndexOfResume(Resume);
}

function softdelete(Resume) {
    console.log(events.DELETE + " event called", Resume)
}


function update(Resume) {
    console.log(events.UPDATE + " event called", Resume)
}

function updateStatus(Resume) {
    resumeService.setProccessDuration(Resume)
}

async function addComment(Resume) {
    let commentCount = await resumeService.getResumeCommentCount(Resume);
    await resumeService.updateSummeryCount(Resume, 'comment', commentCount)
}

async function addCallHistory(Resume) {
    await resumeService.updateSummeryCount(Resume, 'call_history', Resume.call_history.length)
    await resumeService.updateRating(Resume)
}

async function addFile(Resume) {
    await resumeService.updateSummeryCount(Resume, 'file', Resume.call_history.length)
}

async function addTag(Resume) {
    await resumeService.updateSummeryCount(Resume, 'tag', Resume.tags.length)
}