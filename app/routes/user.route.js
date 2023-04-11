import express from 'express'

import { cropEvents } from '../events/subscribers/imageCrop.subscriber.js';
import UserController from '../http/controllers/user.controller.js';
import UserValidation from '../validators/user.validation.js';
import cropImage from '../middlewares/crop.middleware.js';
import { Upload } from '../helper/upload.js';

const userRouter = express.Router();

const avatar_size = [64, 128]

userRouter
    .get('/getMe', UserController.getMe)
    .get('/', UserValidation.index(), UserController.index)
    .get('/:id', UserValidation.find(), UserController.find)
    .post('/avatar', Upload('/users/org/', 'avatar', 'image'), cropImage(avatar_size, cropEvents.Crop_Image), UserValidation.updateProfileImage(), UserController.uploadProfileImage)
    .post('/:id/ban', UserValidation.ban(), UserController.banned)
    .patch('/change-password', UserValidation.changePassword(), UserController.changePassword)
export default userRouter