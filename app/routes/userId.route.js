import express from 'express'
import UserController from '../http/controllers/user.controller.js';
import UserValidation from '../validators/user.validation.js';


const userRouter = express.Router({ mergeParams: true });


userRouter
    .get('/', UserValidation.find(), UserController.find)
    .post('/ban', UserValidation.ban(), UserController.banned)
    .post('/unban', UserValidation.unban(), UserController.unbanned)
    .get('/login-history', UserValidation.loginHistory(), UserController.loginHistory)
    .get('/companies', UserValidation.companies(), UserController.companies)

    .get('/fcm-token', UserValidation.check_fcm_token(), UserController.checkFCMToken)
    .patch('/fcm-token', UserValidation.set_fcm_token(), UserController.setFCMToken)
    .delete('/fcm-token', UserValidation.unset_fcm_token(), UserController.unsetFCMToken);
export default userRouter