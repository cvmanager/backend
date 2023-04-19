import resumeService from '../../helper/service/resume.service.js'
import EventEmitter from '../emitter.js'
export const events = {
    "CREATE": "New Resume",
    "DELETE": "Delete Resume",
    "UPDATE": "Update Resume Info",
    "UPDATE_STATUS": "Update Resume Status",
    "ADD_COMMENT": "add comment for resume",
    "ADD_CALL_HISTORY": "add call history for resume",
    "ADD_FILE": "add file to resume",
    "ADD_TAG": "add tag to resume",
}

EventEmitter.on(events.CREATE, create)
EventEmitter.on(events.DELETE, softdelete)
EventEmitter.on(events.UPDATE, update)
EventEmitter.on(events.UPDATE_STATUS, updateStatus)
EventEmitter.on(events.ADD_COMMENT, addComment)
EventEmitter.on(events.ADD_CALL_HISTORY, addCallHistory)
EventEmitter.on(events.ADD_FILE, addFile)
EventEmitter.on(events.ADD_TAG, addTag)


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
    resumeService.setProccessDuration(Resume)
}

async function addComment(Resume) {
    let commentCount = await resumeService.getResumeCommentCount(Resume);
    resumeService.updateSummeryCount(Resume, 'comment', commentCount)
}

function addCallHistory(Resume) {
    resumeService.updateSummeryCount(Resume, 'call_history', Resume.call_history.length)
}

function addFile(Resume) {
    resumeService.updateSummeryCount(Resume, 'file', Resume.call_history.length)
}

function addTag(Resume) {
    resumeService.updateSummeryCount(Resume, 'tag', Resume.tags.length)
}