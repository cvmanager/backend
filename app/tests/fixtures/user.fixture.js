import { Types } from 'mongoose';
import bcrypt from 'bcrypt';

import User from '../../models/user.model';
import jsonwebtoken from 'jsonwebtoken';
import env from '../../helper/env.js';

const password = 'password1';
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

export const userOne = {
  _id: Types.ObjectId(),
  firstname: "user",
  lastname: "test",
  mobile: "989123456789",
  password,
  is_banned: false
};

export const insertUsers = async (users) => {
  await User.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};

export const accessToken = async (user) => {
  return jsonwebtoken.sign({ sub: user._id, }, env("JWT_SECRET_TOKEN"), {
    expiresIn: env("JWT_EXPIRATION_TIME_TOKEN")
});
};
