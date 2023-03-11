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
    .get('/:id', UserValidation.find(), UserController.find)
    .post('/avatar', Upload('/users/org/', 'avatar', 'image'), cropImage(avatar_size), UserValidation.updateProfileImage(), UserController.uploadProfileImage)
    .post('/:id/ban', UserValidation.ban(), UserController.banned)
    .patch('/change-password', UserValidation.changePassword(), UserController.changePassword)
    .get('/:id/login-history', UserValidation.loginHistory(), UserController.loginHistory)
    .patch('/:id', UserValidation.edit(), UserController.edit)
    
export default userRouter 