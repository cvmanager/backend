import express from 'express'
import UserController from '../http/controllers/user.controller.js';
import UserValidation from '../validators/user.validation.js';
import { Upload } from '../helper/upload.js';

const userRouter = express.Router();

userRouter
    .get('/getMe', UserController.getMe)
    .get('/', UserValidation.index(), UserController.index)
    .get('/:id', UserValidation.find(), UserController.find)
    .post('/avatar', Upload('users', 'avatar', 'image'), UserValidation.updateProfileImage(), UserController.uploadProfileImage)
    .post('/:id/ban', UserValidation.ban(), UserController.banned)
    .patch('/change-password', UserValidation.changePassword(), UserController.changePassword)

export default userRouter