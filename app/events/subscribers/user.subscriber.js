import userService from "../../helper/service/user.service.js";
import EventEmitter from "../emitter.js";

export const UserEvents = {
    "LOGIN": "Login User",
    "SINGUP": "Singup User",
    "REFRESH": "",
    "LOGOUT": "Logout User",
    "BANNED": "Banned User",
    "EDIT_USER": "Edit User",
    "UNBANNED": "UnBanned User",
    "ROLE": "update User role"
}

EventEmitter.on(UserEvents.LOGIN, login);
EventEmitter.on(UserEvents.SINGUP, signup);
EventEmitter.on(UserEvents.BANNED, banned);
EventEmitter.on(UserEvents.UNBANNED, unbanned);
EventEmitter.on(UserEvents.LOGOUT, logout);
EventEmitter.on(UserEvents.EDIT_USER, editUser);
EventEmitter.on(UserEvents.ROLE, role);


function login(user, req, access_token, refresh_token) {
    userService.setLogForLogin(user, access_token, refresh_token);
}

function signup(user, req, access_token, refresh_token) {
    userService.setLogForLogin(user, access_token, refresh_token, 'register')
}

function banned(user, req) {
    console.log(UserEvents.BANNED + " event called", user)
}

function editUser(user, req) {
    console.log(UserEvents.EDIT_USER + " event called", user)
}
function unbanned(user, req) {
    console.log(UserEvents.UNBANNED + " event called", user)
}

function logout(access_token) {
    userService.setLogForLogout(access_token);
}

function role(user) {
    console.log(UserEvents.ROLE + " event called", user)
}