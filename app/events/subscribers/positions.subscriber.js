import positionService from '../../helper/service/position.service.js'
import EventEmitter from '../emitter.js'

export const events = {
    "CREATE": "New Position",
    "DELETE": "Delete Position",
    "UPDATE": "Update Position Info",
    "SET_MANAGER": "Set New Manager For Position",
    "UNSET_MANAGER": "UnSet  Manager For Position",
    "ACTIVE": "active Position status",
    "DEACTIVE": "deactive Position status",
}

EventEmitter.on(events.CREATE, create)
EventEmitter.on(events.DELETE, softdelete)
EventEmitter.on(events.UPDATE, update)
EventEmitter.on(events.SET_MANAGER, setManager)
EventEmitter.on(events.UNSET_MANAGER, unsetManager)
EventEmitter.on(events.ACTIVE, active)
EventEmitter.on(events.DEACTIVE, deActive)


function active(position) {
    console.log(events.ACTIVE + " event called", position)
}

function deActive(position) {
    console.log(events.DEACTIVE + " event called", position)
}

function create(Position) {
   positionService.addDefaultManagerForPosition(Position)
}


function softdelete(Position) {
    positionService.deleteManagersFromPosition(Company)
}


function update(Position) {
    console.log(events.UPDATE + " event called", Position)
}

function setManager(Position) {
    console.log(events.SET_MANAGER + " event called", Position)
}

function unsetManager(Position) {
    console.log(events.UNSET_MANAGER + " event called", Position)
}

