// import Repository from './index';
import { users } from './data';
import User from '../../models/user.model.js';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import env from '../../helper/env.js';

class UserMock {
    token;
    user = {};
    users;
    salt;

    constructor() {
        this.salt = bcrypt.genSaltSync(10);
        User.insertMany(users.map((user) => ({ ...user, password: bcrypt.hashSync(user.password, this.salt) })));
        this.users = users;
        this.user = Object.values(users)[0];
    }

    index() {
        return this.users = users;
    }

    set(users) {
        User.insertMany(users.map((user) => ({ ...user, password: bcrypt.hashSync(user.password, this.salt) })));
    }

    get() {
        return this.user = Object.values(users)[0];
    }

    accessToken() {
        return 'Bearer ' + jsonwebtoken.sign({ sub: this.user._id, }, env("JWT_SECRET_TOKEN"), {
            expiresIn: env("JWT_EXPIRATION_TIME_TOKEN")
        });
    };



}

export default UserMock