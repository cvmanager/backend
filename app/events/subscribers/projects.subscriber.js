import EventEmitter from '../emitter.js'
import { addDefaultManagerForProject, deleteManagersFromProject } from '../../helper/service/project.service.js';

export const events = {
    "CREATE": "New Project",
    "DELETE": "Delete Project",
    "UPDATE": "Update Project Info",
    "SET_MANAGER": "Set New Manager For Project",
    "UNSET_MANAGER": "UnSet  Manager For Project"
}

EventEmitter.on(events.CREATE, create)
EventEmitter.on(events.DELETE, softdelete)
EventEmitter.on(events.UPDATE, update)
EventEmitter.on(events.SET_MANAGER, setManager)
EventEmitter.on(events.UNSET_MANAGER, unsetManager)


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

