import express from 'express'
import ResumeController from '../http/controllers/resume.controller.js';
import ResumeValidation from '../validators/resume.validation.js';
import { fillFullName } from '../middlewares/lowerCase.middleware.js';

const resumeRouter = express.Router();

resumeRouter
    .get('/', ResumeValidation.index(), fillFullName, ResumeController.index)
    .post('/', ResumeValidation.create(), fillFullName, ResumeController.create)
export default resumeRouter