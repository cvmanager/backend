import express from 'express'
import ResumeController from '../http/controllers/resume.controller.js';
import ResumeValidation from '../validators/resume.validation.js';
import { toLowerCase } from '../middlewares/lowerCase.middleware.js';

const resumeRouter = express.Router();

resumeRouter
    .get('/', ResumeValidation.index(), toLowerCase, ResumeController.index)
    .post('/', ResumeValidation.create(), toLowerCase, ResumeController.create)
export default resumeRouter