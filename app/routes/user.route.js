import express from 'express'
import UserController from '../http/controllers/user.controller.js';
import UserValidation from '../validators/user.validation.js';
import cropImage from '../middlewares/crop.middleware.js';
import { Upload } from '../helper/upload.js';

const userRouter = express.Router();

const avatar_size = [64, 128]

userRouter
    .get('/getMe', UserController.getMe)
    .get('/', UserValidation.index(), UserController.index)
    .post('/avatar', Upload('/users/org/', 'avatar', 'image'), UserValidation.updateProfileImage(), cropImage(avatar_size), UserController.uploadProfileImage)
    .patch('/change-password', UserValidation.changePassword(), UserController.changePassword)
export default userRouter
