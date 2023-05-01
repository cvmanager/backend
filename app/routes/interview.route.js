import express from 'express'
import ResumeInterviewController from '../http/controllers/resumeInterview.controller.js';
import ResumeInterviewValidation from '../validators/resumeInterview.validation.js';

const resumeInterviewRouter = express.Router({ mergeParams: true });

resumeInterviewRouter
    .get('/', ResumeInterviewValidation.index(), ResumeInterviewController.index)
    .post('/', ResumeInterviewValidation.create(), ResumeInterviewController.create)

export default resumeInterviewRouter