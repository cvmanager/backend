import express from 'express'
import AuthController from '../http/controllers/auth.controller.js'
import AuthValidator from '../validators/auth.validation.js'
import { verifyRefrshToken, verifyToken } from '../middlewares/auth.middleware.js';

const authRouter = express.Router();

authRouter
    .post('/signup', AuthValidator.signup(), AuthController.signup)
    .post('/login', AuthValidator.login(), AuthController.login)
    .post('/logout', verifyToken, AuthController.logout)
    .post('/refresh', verifyRefrshToken, AuthController.refresh)
    .post('/verify-token', verifyToken, AuthController.verifyToken)
    .post('/check-username', AuthController.checkusername)

export default authRouter