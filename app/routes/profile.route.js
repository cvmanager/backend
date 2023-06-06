import express from 'express'
import ProfileController from '../http/controllers/profile.controller.js'
import profileValidation from '../validators/profile.validation.js';
import { cropEvents } from '../events/subscribers/imageCrop.subscriber.js';
import cropImage from '../middlewares/crop.middleware.js';
import { Upload } from '../helper/upload.js';
const avatar_size = [64, 128]

const profileRouter = express.Router();

profileRouter
    .get('/get-me', ProfileController.getMe)
    .patch('/change-password', profileValidation.changePassword(), ProfileController.changePassword)
    .patch('/avatar', Upload('users/org/', 'avatar', 'image'), cropImage(avatar_size, cropEvents.Crop_Image), ProfileController.uploadProfileImage)
    .patch('/', profileValidation.edit(), ProfileController.edit)
    .get('/notifications', profileValidation.notifications(), ProfileController.notifications)
    .patch('/observed-notifications', ProfileController.observedNotifications)



export default profileRouter