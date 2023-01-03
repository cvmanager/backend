import EventEmitter from '../emitter.js'
import { addDefaultManagerForProject, deleteManagersFromProject } from '../../helper/service/project.service.js';

export const projectEvents = {
    "NEW_PROJECT": "NEW_PROJECT",
    "DELETE_PROJECT": "DELETE_PROJECT"
}

EventEmitter.on(projectEvents.NEW_PROJECT, newProject)
EventEmitter.on(projectEvents.DELETE_PROJECT, deleteProject)

function newProject(project) {
    addDefaultManagerForProject(project);
}

function deleteProject(project) {
    deleteManagersFromProject(project);
}