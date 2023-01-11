import EventEmitter from '../emitter.js'

export const events = {
    "CREATE": "New Position",
    "DELETE": "Delete Position",
    "UPDATE": "Update Position Info",
    "SET_MANAGER": "Set New Manager For Position",
    "UNSET_MANAGER": "UnSet  Manager For Position"
}

EventEmitter.on(events.CREATE, create)
EventEmitter.on(events.DELETE, softdelete)
EventEmitter.on(events.UPDATE, update)
EventEmitter.on(events.SET_MANAGER, setManager)
EventEmitter.on(events.UNSET_MANAGER, unsetManager)



function create(Position) {
    console.log(events.DELETE + " event called", Position)
}


function softdelete(Position) {
    console.log(events.DELETE + " event called", Position)
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

