import EventEmitter from '../emitter.js'
import { addDefaultManagerForProject, deleteManagersFromProject } from '../../helper/service/project.service.js';

export const events = {
    "CREATE": "New Project",
    "DELETE": "Delete Project",
    "UPDATE": "Update Project Info",
    "SET_MANAGER": "Set New Manager For Project",
    "UNSET_MANAGER": "UnSet  Manager For Project",
    "ACTIVE": "active project status",
    "DEACTIVE": "deactive project status",
}

EventEmitter.on(events.CREATE, create)
EventEmitter.on(events.DELETE, softdelete)
EventEmitter.on(events.UPDATE, update)
EventEmitter.on(events.SET_MANAGER, setManager)
EventEmitter.on(events.UNSET_MANAGER, unsetManager)
EventEmitter.on(events.ACTIVE, active)
EventEmitter.on(events.DEACTIVE, deActive)

function active(project) {
    console.log(events.ACTIVE + " event called", project)
}

function deActive(project) {
    console.log(events.DEACTIVE + " event called", project)
}

function create(project) {
    addDefaultManagerForProject(project);
}

function softdelete(project) {
    deleteManagersFromProject(project);
}

function update(project) {
    console.log(events.UPDATE + " event called", project)
}

function setManager(project) {
    console.log(events.SET_MANAGER + " event called", project)
}

function unsetManager(project) {
    console.log(events.UNSET_MANAGER + " event called", project)
}

