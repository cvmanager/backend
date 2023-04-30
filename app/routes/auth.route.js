import express from 'express'
import AuthController from '../http/controllers/auth.controller.js'
import AuthValidator from '../validators/auth.validation.js'
import { verifyRefrshToken, verifyToken } from '../middlewares/auth.middleware.js';
import { fillFullName } from '../middlewares/lowerCase.middleware.js';

const authRouter = express.Router();

authRouter
    .post('/signup', AuthValidator.signup(), fillFullName, AuthController.signup)
    .post('/login', AuthValidator.login(), AuthController.login)
    .post('/logout', verifyToken, AuthController.logout)
    .post('/refresh', verifyRefrshToken, AuthController.refresh)
    .post('/verify-token', verifyToken, AuthController.verifyToken)
    .post('/username-isavailable', AuthValidator.checkusername(), AuthController.checkusername)

export default authRouter