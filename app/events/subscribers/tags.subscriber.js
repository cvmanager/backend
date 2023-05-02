import EventEmitter from '../emitter.js'
export const TagEvents = {
    "TAG_USE": "add tag to resume",
}

EventEmitter.on(TagEvents.TAG_USE, tagUse)

async function tagUse(Tag,req) {
}

