import userService from "../../helper/service/user.service.js";
import EventEmitter from "../emitter.js";

export const events = {
    "LOGIN": "Login User",
    "SINGUP": "Singup User",
    "REFRESH": "",
    "LOGOUT": "Logout User",
    "BANNED": "Banned User",
    "EDIT_USER": "Edit User",
    "UNBANNED": "UnBanned User"
}

EventEmitter.on(events.LOGIN, login);
EventEmitter.on(events.SINGUP, signup);
EventEmitter.on(events.BANNED, banned);
EventEmitter.on(events.UNBANNED, unbanned);
EventEmitter.on(events.LOGOUT, logout);
EventEmitter.on(events.EDIT_USER, editUser);


function login(user, access_token, refresh_token) {
    userService.setLogForLogin(user, access_token, refresh_token);
}

function signup(user, access_token, refresh_token) {
    userService.setLogForLogin(user, access_token, refresh_token, 'register')
}

function banned(user) {
    console.log(events.BANNED + " event called", user)
}

function editUser(user) {
    console.log(events.EDIT_USER + " event called", user)
}
function unbanned(user) {
    console.log(events.UNBANNED + " event called", user)
}

function logout(access_token) {
    userService.setLogForLogout(access_token);
}