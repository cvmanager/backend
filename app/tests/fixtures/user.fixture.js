import { Types } from 'mongoose';
import bcrypt from 'bcrypt';

import User from '../../models/user.model';

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

export const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzM5M2U4OTBkNzIwZDBjYWZlNWE0NWIiLCJpYXQiOjE2NjkyMDcyMzgsImV4cCI6MTY2OTI5MzYzOH0.S5BHgfXI8ohWAfEjavx7IX4xNgyVfXUQCnSX4mhF17s"
export const refresh_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzM5M2U4OTBkNzIwZDBjYWZlNWE0NWIiLCJpYXQiOjE2NjkyMDcyMzgsImV4cCI6MTY2OTI5MzYzOH0.S5BHgfXI8ohWAfEjavx7IX4xNgyVfXUQCnSX4mhF17s"
