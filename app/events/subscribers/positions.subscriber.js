import positionService from '../../helper/service/position.service.js'
import EventEmitter from '../emitter.js'

export const PositionEvents = {
    "CREATE": "New Position",
    "DELETE": "Delete Position",
    "UPDATE": "Update Position Info",
    "SET_MANAGER": "Set New Manager For Position",
    "UNSET_MANAGER": "UnSet  Manager For Position",
    "ACTIVE": "active Position status",
    "DEACTIVE": "deactive Position status",
}

EventEmitter.on(PositionEvents.CREATE, create)
EventEmitter.on(PositionEvents.DELETE, softdelete)
EventEmitter.on(PositionEvents.UPDATE, update)
EventEmitter.on(PositionEvents.SET_MANAGER, setManager)
EventEmitter.on(PositionEvents.UNSET_MANAGER, unsetManager)
EventEmitter.on(PositionEvents.ACTIVE, active)
EventEmitter.on(PositionEvents.DEACTIVE, deActive)


function active(position) {
    console.log(PositionEvents.ACTIVE + " event called", position)
}

function deActive(position) {
    console.log(PositionEvents.DEACTIVE + " event called", position)
}

function create(Position) {
   positionService.addDefaultManagerForPosition(Position)
}


function softdelete(Position) {
    positionService.deleteManagersFromPosition(Position)
}


function update(Position) {
    console.log(PositionEvents.UPDATE + " event called", Position)
}

function setManager(Position) {
    console.log(PositionEvents.SET_MANAGER + " event called", Position)
}

function unsetManager(Position) {
    console.log(PositionEvents.UNSET_MANAGER + " event called", Position)
}

