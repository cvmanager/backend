import { users } from './data';

import jsonwebtoken from 'jsonwebtoken';
import env from '../../helper/env.js';

class UserData {
    mobile = Object.values(users)[0].mobile;
    user = {};

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
        return 'Bearer ' + jsonwebtoken.sign({ sub: this.user._id, }, env("JWT_SECRET_TOKEN"), {
            expiresIn: env("JWT_EXPIRATION_TIME_TOKEN")
        });
    };

}

export default UserData