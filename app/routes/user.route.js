import express from 'express'
import UserController from '../http/controllers/user.controller.js';
import { find, updateProfileImage } from '../validators/user.validation.js';
import { Upload } from '../helper/upload.js';

const userRouter = express.Router();

userRouter
    .get('/', UserController.index)
    .get('/:id', find, UserController.find)
    .post('/avatar', Upload.single('avatar'), updateProfileImage, UserController.uploadProfileImage)

export default userRouter