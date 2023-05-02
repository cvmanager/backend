import resumeService from '../../helper/service/resume.service.js'
import viewlogService from '../../helper/service/viewlog.service.js'
import EventEmitter from '../emitter.js'
export const ResumeEvents = {
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

EventEmitter.on(ResumeEvents.FIND, find)
EventEmitter.on(ResumeEvents.CREATE, create)
EventEmitter.on(ResumeEvents.DELETE, softdelete)
EventEmitter.on(ResumeEvents.UPDATE, update)
EventEmitter.on(ResumeEvents.UPDATE_STATUS, updateStatus)
EventEmitter.on(ResumeEvents.ADD_COMMENT, addComment)
EventEmitter.on(ResumeEvents.ADD_CALL_HISTORY, addCallHistory)
EventEmitter.on(ResumeEvents.ADD_FILE, addFile)
EventEmitter.on(ResumeEvents.ADD_TAG, setTag)
EventEmitter.on(ResumeEvents.REMOVE_TAG, unsetTag)

async function find(Resume) {
    await viewlogService.setViewlog('resumes', Resume._id, Resume.created_by)
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

async function setTag(Resume) {
    await resumeService.updateSummeryCount(Resume, 'tag', Resume.tags.length)
}

async function unsetTag(Resume) {
    await resumeService.updateSummeryCount(Resume, 'tag', Resume.tags.length)
}