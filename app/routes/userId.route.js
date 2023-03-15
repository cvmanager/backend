import express from 'express'
import UserController from '../http/controllers/user.controller.js';
import UserValidation from '../validators/user.validation.js';
const userRouter = express.Router();

userRouter
    .get('/', UserValidation.find(), UserController.find)
    .post('/ban', UserValidation.ban(), UserController.banned)
    .get('/login-history', UserValidation.loginHistory(), UserController.loginHistory);
export default userRouter