import { users } from './data';

import jsonwebtoken from 'jsonwebtoken';
import env from '../../helper/env.js';
import User from '../../models/user.model';
import bcrypt from 'bcrypt';

class UserData {
    mobile = Object.values(users)[0].mobile;
    user = {};
    salt = '';

    constructor() {
        this.user = this.getUser();
    }

    getUser() {
        return users.find(user => user.mobile == this.mobile);
    }

    getUsers() {
        return users;
    }

    getAccessToken() {
        return 'Bearer ' + jsonwebtoken.sign({ sub: { _id: this.user._id, role: this.user.role } }, env("JWT_SECRET_TOKEN"), {
            expiresIn: env("JWT_EXPIRATION_TIME_TOKEN")
        });
    };

    getFakeAccessToken(id) {
        return 'Bearer ' + jsonwebtoken.sign({ sub: { _id: id, role: [id] } }, env("JWT_SECRET_TOKEN"), {
            expiresIn: env("JWT_EXPIRATION_TIME_TOKEN")
        });
    };

    async setUsers(users) {
        this.salt = bcrypt.genSaltSync(10);
        await User.insertMany(users.map((user) => ({ ...user, password: bcrypt.hashSync(user.password, this.salt) })));
    }

}

export default UserData