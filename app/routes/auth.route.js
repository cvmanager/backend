import express from 'express'
import AuthController from '../http/controllers/auth.controller.js'
import { signup, login } from '../validators/auth.validation.js'
import { verifyRefrshToken, verifyToken } from '../middlewares/auth.middleware.js';

const authRouter = express.Router();

authRouter
    .post('/signup', signup, AuthController.signup)
    .post('/login', login, AuthController.login)
    .post('/logout', verifyToken, AuthController.logout)
    .post('/refresh', verifyRefrshToken, AuthController.refresh)
    .post('/verify-token', verifyToken, AuthController.verifyToken)

export default authRouter