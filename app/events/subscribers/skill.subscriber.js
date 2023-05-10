import EventEmitter from '../emitter.js'

export const SkillEvents = {
    "CREATE": "New Skill",
}

EventEmitter.on(SkillEvents.CREATE, create)

async function create(Skill, req) {
    console.log(SkillEvents.CREATE + " event called", Skill)
}

