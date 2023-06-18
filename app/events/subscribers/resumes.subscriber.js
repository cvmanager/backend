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
    "SET_ASSIGNER": "set assigner to resume",
    "UNSET_ASSIGNER": "un set assigner to resume",
    "SET_SKILL": "set skill to resume",
    "UNSET_SKILL": "un set skill to resume",
    "UPDATE_AVATAR": "UPDATE_AVATAR",
    "GET_INTERVIEW": "GET_INTERVIEW"
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
EventEmitter.on(ResumeEvents.SET_ASSIGNER, setAssigner)
EventEmitter.on(ResumeEvents.UNSET_ASSIGNER, unsetAssigner)
EventEmitter.on(ResumeEvents.SET_SKILL, setSkill)
EventEmitter.on(ResumeEvents.UNSET_SKILL, unsetSkill)

async function find(Resume, req) {
    await viewlogService.setViewlog('resumes', Resume.id, req)
    let viewlogCount = await resumeService.getResumeViewCount(Resume);
    await resumeService.updateSummeryCount(Resume, 'view', viewlogCount)
}

async function create(Resume, req) {
    await resumeService.fillIndexOfResume(Resume);
}

function softdelete(Resume, req) {
    console.log(ResumeEvents.DELETE + " event called", Resume)
}


function update(Resume, req) {
    console.log(ResumeEvents.UPDATE + " event called", Resume)
}

async function updateStatus(Resume, req, oldStatus) {
    await resumeService.addUpdateStatusLog(Resume, req, oldStatus)
    await resumeService.setProccessDuration(Resume)
    await resumeService.setNotificationWhenUpdateStatus(Resume, req, 'update_status');

}


async function addComment(Resume, req) {
    let commentCount = await resumeService.getResumeCommentCount(Resume)
    await resumeService.updateSummeryCount(Resume, 'comment', commentCount)
}

async function addCallHistory(Resume, req) {
    await resumeService.updateSummeryCount(Resume, 'call_history', Resume.call_history.length)
    await resumeService.updateRating(Resume)
}

async function addFile(Resume, req) {
    await resumeService.updateSummeryCount(Resume, 'file', Resume.call_history.length)
}

async function setTag(Resume, req) {
    await resumeService.updateSummeryCount(Resume, 'tag', Resume.tags.length)
}

async function unsetTag(Resume, req) {
    await resumeService.updateSummeryCount(Resume, 'tag', Resume.tags.length)
}

async function setSkill(Resume, req) {
    console.log(ResumeEvents.SET_SKILL + " event called", Resume)
}

async function unsetSkill(Resume, req) {
    console.log(ResumeEvents.UNSET_SKILL + " event called", Resume)
}

async function setAssigner(Resume, req) {
    console.log(ResumeEvents.SET_ASSIGNER + " event called", Resume)
}

async function unsetAssigner(Resume, req) {
    console.log(ResumeEvents.UNSET_ASSIGNER + " event called", Resume)
}