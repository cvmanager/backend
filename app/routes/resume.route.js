import express from 'express'
import ResumeController from '../http/controllers/resume.controller.js';
import ResumeValidation from '../validators/resume.validation.js';
import { Upload } from '../helper/upload.js';

const resumeRouter = express.Router();

resumeRouter
    .get('/', ResumeValidation.index(), ResumeController.index)
    .post('/', ResumeValidation.create(), ResumeController.create)
export default resumeRouter