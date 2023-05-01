import projectService from '../../helper/service/project.service.js'
import EventEmitter from '../emitter.js'

export const ProjectEvents = {
    "CREATE": "New Project",
    "DELETE": "Delete Project",
    "UPDATE": "Update Project Info",
    "SET_MANAGER": "Set New Manager For Project",
    "UNSET_MANAGER": "UnSet  Manager For Project",
    "ACTIVE": "active project status",
    "DEACTIVE": "deactive project status",
}

EventEmitter.on(ProjectEvents.CREATE, create)
EventEmitter.on(ProjectEvents.DELETE, softdelete)
EventEmitter.on(ProjectEvents.UPDATE, update)
EventEmitter.on(ProjectEvents.SET_MANAGER, setManager)
EventEmitter.on(ProjectEvents.UNSET_MANAGER, unsetManager)
EventEmitter.on(ProjectEvents.ACTIVE, active)
EventEmitter.on(ProjectEvents.DEACTIVE, deActive)

function active(project) {
    console.log(ProjectEvents.ACTIVE + " event called", project)
}

function deActive(project) {
    console.log(ProjectEvents.DEACTIVE + " event called", project)
}

function create(project) {
   projectService.addDefaultManagerForProject(project);
}

function softdelete(project) {
    projectService.deleteManagersFromProject(project);
}

function update(project) {
    console.log(ProjectEvents.UPDATE + " event called", project)
}

function setManager(project) {
    console.log(ProjectEvents.SET_MANAGER + " event called", project)
}

function unsetManager(project) {
    console.log(ProjectEvents.UNSET_MANAGER + " event called", project)
}

