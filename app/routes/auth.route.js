import express from 'express'
import AuthController from '../http/controllers/auth.controller.js'
import AuthValidator from '../validators/auth.validation.js'
import { verifyRefrshToken, verifyToken } from '../middlewares/auth.middleware.js';
import { toLowerCase } from '../middlewares/lowerCase.middleware.js';

const authRouter = express.Router();

authRouter
    .get('/get-me', verifyToken, AuthController.getMe)
    .post('/signup', AuthValidator.signup(), toLowerCase, AuthController.signup)
    .post('/login', AuthValidator.login(), AuthController.login)
    .post('/logout', verifyToken, AuthController.logout)
    .post('/refresh', verifyRefrshToken, AuthController.refresh)
    .post('/verify-token', verifyToken, AuthController.verifyToken)
    .post('/username-isavailable', AuthValidator.checkusername(), AuthController.checkusername)
    .post('/send-verify', verifyToken, AuthController.sendMobileVerificationCode)
    .post('/check-verify', AuthValidator.checkVerifyMobileCode(), verifyToken, AuthController.checkMobileVerificationCode)

export default authRouter