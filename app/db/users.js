import bcrypt from 'bcrypt'

let salt = await bcrypt.genSalt(10);
let hash_password = await bcrypt.hash("some-pass", salt);

let users = [
    {
        "firstname": "fater",
        "lastname": "admin",
        "username": "admin",
        "mobile": "989123456789",
        "password": hash_password,
        "mobile_verified_at": null,
        "avatar": "",
        "is_banned": null,
        "banned_by": null,
        "banned_at": null,
        "role": ["636793ebed4e4ba2664f2cbe"],
        "deleted": false,
        "email": "admin@cv.com"
    }
]


export default users