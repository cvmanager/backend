import express from 'express'

import UserController from '../http/controllers/user.controller.js';
import UserValidation from '../validators/user.validation.js';

const userRouter = express.Router();
userRouter
    .get('/', UserValidation.index(), UserController.index)
    .patch('/change-password', UserValidation.changePassword(), UserController.changePassword)
export default userRouter
