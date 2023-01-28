import EventEmitter from "../emitter.js";
import { setLogForLogin, setLogForLogout } from '../../helper/service/user.service.js';

export const events = {
    "LOGIN": "Login User",
    "SINGUP": "Singup User",
    "REFRESH": "",
    "LOGOUT": "Logout User",
    "BANNED": "Banned User",
    "LOGOUT": "Logout User",
}

EventEmitter.on(events.LOGIN, login);
EventEmitter.on(events.SINGUP, signup);
EventEmitter.on(events.BANNED, banned);
EventEmitter.on(events.LOGOUT, logout);


function login(user, access_token, refresh_token) {
    setLogForLogin(user, access_token, refresh_token);
}

function signup(user) {
    console.log(events.SINGUP + " event called", user)
}

function banned(user) {
    console.log(events.BANNED + " event called", user)
}

function logout(access_token) {
    setLogForLogout(access_token);
}