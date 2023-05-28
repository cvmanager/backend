import express from 'express'
import ProfileController from '../http/controllers/profile.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js';
import profileValidation from '../validators/profile.validation.js';

const profileRouter = express.Router();

profileRouter
    .get('/get-me', ProfileController.getMe)
    .patch('/change-password', profileValidation.changePassword(), ProfileController.changePassword)


export default profileRouter