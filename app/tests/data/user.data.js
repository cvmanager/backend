import { users } from './data';

import jsonwebtoken from 'jsonwebtoken';
import env from '../../helper/env.js';
import User from '../../models/user.model';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

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

    async saveBannedUser() {
        let user = {
            "_id": Types.ObjectId(),
            "firstname": faker.name.firstName(),
            "lastname": faker.name.lastName(),
            "username": faker.random.alpha(9),
            "is_banned": true,
            "mobile": faker.phone.number('989#########'),
            "email": faker.internet.email(),
            "password": '12345678'
        }
        this.setUsers([user]);
        return user;
    }
}

export default UserData