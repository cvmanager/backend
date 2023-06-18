import express from 'express'

import UserController from '../http/controllers/user.controller.js';
import UserValidation from '../validators/user.validation.js';

const userRouter = express.Router();
userRouter
    .get('/', UserValidation.index(), UserController.index)
export default userRouter
