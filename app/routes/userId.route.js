import express from 'express'
import UserController from '../http/controllers/user.controller.js';
import UserValidation from '../validators/user.validation.js';
import { cropEvents } from '../events/subscribers/imageCrop.subscriber.js';
import cropImage from '../middlewares/crop.middleware.js';
import { Upload } from '../helper/upload.js';

const userRouter = express.Router({ mergeParams: true });
const avatar_size = [64, 128]

userRouter
    .get('/', UserValidation.find(), UserController.find)
    .patch('/', UserValidation.edit(), UserController.edit)
    .post('/ban', UserValidation.ban(), UserController.banned)
    .post('/unban', UserValidation.unban(), UserController.unbanned)
    .get('/login-history', UserValidation.loginHistory(), UserController.loginHistory)
    .patch('/avatar', Upload('users/org/', 'avatar', 'image'), cropImage(avatar_size, cropEvents.Crop_Image), UserValidation.updateProfileImage(), UserController.uploadProfileImage)
    .get('/companies', UserValidation.companies(), UserController.companies);
export default userRouter