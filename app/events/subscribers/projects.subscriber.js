import projectService from '../../helper/service/project.service.js'
import EventEmitter from '../emitter.js'
import viewlogService from '../../helper/service/viewlog.service.js'
export const ProjectEvents = {
    "FIND": "Find Project",
    "CREATE": "New Project",
    "DELETE": "Delete Project",
    "UPDATE": "Update Project Info",
    "SET_MANAGER": "Set New Manager For Project",
    "UNSET_MANAGER": "UnSet  Manager For Project",
    "ACTIVE": "active project status",
    "DEACTIVE": "deactive project status",
}
EventEmitter.on(ProjectEvents.FIND, find)
EventEmitter.on(ProjectEvents.CREATE, create)
EventEmitter.on(ProjectEvents.DELETE, softdelete)
EventEmitter.on(ProjectEvents.UPDATE, update)
EventEmitter.on(ProjectEvents.SET_MANAGER, setManager)
EventEmitter.on(ProjectEvents.UNSET_MANAGER, unsetManager)
EventEmitter.on(ProjectEvents.ACTIVE, active)
EventEmitter.on(ProjectEvents.DEACTIVE, deActive)


async function find(Project, req) {
    await viewlogService.setViewlog('projects', Project._id, req)
}
function active(project, req) {
    console.log(ProjectEvents.ACTIVE + " event called", project)
}

function deActive(project, req) {
    console.log(ProjectEvents.DEACTIVE + " event called", project)
}

function create(project, req) {
    projectService.addDefaultManagerForProject(project);
}

function softdelete(project, req) {
    projectService.deleteManagersFromProject(project);
}

function update(project, req) {
    console.log(ProjectEvents.UPDATE + " event called", project)
}

function setManager(project, req) {
    console.log(ProjectEvents.SET_MANAGER + " event called", project)
}

function unsetManager(project, req) {
    console.log(ProjectEvents.UNSET_MANAGER + " event called", project)
}

