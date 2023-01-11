import EventEmitter from "../emitter.js";

export const events = {
    "LOGIN": "Login User",
    "SINGUP": "Singup User",
    "REFRESH": "",
    "LOGOUT": "Logout User",
    "BANNED": "Banned User",
}

EventEmitter.on(events.LOGIN, login);
EventEmitter.on(events.SINGUP, signup);
EventEmitter.on(events.BANNED, banned);


function login(user) {
    console.log(events.LOGIN + " event called", user)
}

function signup(user) {
    console.log(events.SINGUP + " event called", user)
}

function banned(user) {
    console.log(events.BANNED + " event called", user)
}