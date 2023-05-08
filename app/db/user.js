import roles from "./roles.js";
let systemManager = roles.find(role => role.name === 'System Manager')

let user = {
    "firstname": "fater",
    "lastname": "admin",
    "username": "admin",
    "mobile": "989123456789",
    "password": "some-pass",
    "mobile_verified_at": null,
    "avatar": "",
    "is_banned": null,
    "banned_by": null,
    "banned_at": null,
    "role": [systemManager._id],
    "deleted": false,
    "email": "admin@cv.com"
}


export default user