import express from 'express'
import ResumeInterviewController from '../http/controllers/resumeInterview.controller.js';
import ResumeInterviewValidation from '../validators/resumeInterview.validation.js';

const resumeInterviewIdRouter = express.Router({ mergeParams: true });

resumeInterviewIdRouter
    .get('/', ResumeInterviewValidation.find(), ResumeInterviewController.find)
    .patch('/', ResumeInterviewValidation.update(), ResumeInterviewController.update)
    .delete('/', ResumeInterviewValidation.remove(), ResumeInterviewController.delete)

export default resumeInterviewIdRouter