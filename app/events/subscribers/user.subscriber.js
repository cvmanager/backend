import EventEmitter from "../emitter.js";
import { setLogForLogin } from '../../helper/service/user.service.js';

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


function login(user, access_token, refresh_token) {
    setLogForLogin(user, access_token, refresh_token);
}

function signup(user, access_token, refresh_token) {
    setLogForLogin(user, access_token, refresh_token, 'register')
}

function banned(user) {
    console.log(events.BANNED + " event called", user)
}