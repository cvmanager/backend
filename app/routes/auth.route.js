import express from 'express'
import AuthController from '../http/controllers/auth.controller.js'
import AuthValidator from '../validators/auth.validation.js'
import { verifyRefreshToken, verifyToken } from '../middlewares/auth.middleware.js';
import { toLowerCase } from '../middlewares/lowerCase.middleware.js';

const authRouter = express.Router();

authRouter
    .post('/signup', AuthValidator.signup(), toLowerCase, AuthController.signup)
    .post('/login', AuthValidator.login(), AuthController.login)
    .post('/logout', verifyToken, AuthController.logout)
    .post('/refresh', verifyRefreshToken, AuthController.refresh)
    .post('/verify-token', verifyToken, AuthController.verifyToken)
    .post('/username-isavailable', AuthValidator.checkUsername(), AuthController.checkUsername)
    .post('/send-verify', verifyToken, AuthController.sendMobileVerificationCode)
    .post('/check-verify', AuthValidator.checkVerifyMobileCode(), verifyToken, AuthController.checkMobileVerificationCode)


export default authRouter