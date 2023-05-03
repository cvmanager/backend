import positionService from '../../helper/service/position.service.js'
import viewlogService from '../../helper/service/viewlog.service.js'
import EventEmitter from '../emitter.js'

export const PositionEvents = {
    "FIND": "Find Position",
    "CREATE": "New Position",
    "DELETE": "Delete Position",
    "UPDATE": "Update Position Info",
    "SET_MANAGER": "Set New Manager For Position",
    "UNSET_MANAGER": "UnSet  Manager For Position",
    "ACTIVE": "active Position status",
    "DEACTIVE": "deactive Position status",
}

EventEmitter.on(PositionEvents.FIND, find)
EventEmitter.on(PositionEvents.CREATE, create)
EventEmitter.on(PositionEvents.DELETE, softdelete)
EventEmitter.on(PositionEvents.UPDATE, update)
EventEmitter.on(PositionEvents.SET_MANAGER, setManager)
EventEmitter.on(PositionEvents.UNSET_MANAGER, unsetManager)
EventEmitter.on(PositionEvents.ACTIVE, active)
EventEmitter.on(PositionEvents.DEACTIVE, deActive)

async function find(position, req) {
    await viewlogService.setViewlog('positions', position._id, req)
}

function active(position, req) {
    console.log(PositionEvents.ACTIVE + " event called", position)
}

function deActive(position, req) {
    console.log(PositionEvents.DEACTIVE + " event called", position)
}

function create(Position, req) {
    positionService.addDefaultManagerForPosition(Position)
}


function softdelete(Position, req) {
    positionService.deleteManagersFromPosition(Position)
}


function update(Position, req) {
    console.log(PositionEvents.UPDATE + " event called", Position)
}

function setManager(Position, req) {
    console.log(PositionEvents.SET_MANAGER + " event called", Position)
}

function unsetManager(Position, req) {
    console.log(PositionEvents.UNSET_MANAGER + " event called", Position)
}

