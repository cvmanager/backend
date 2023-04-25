import express from 'express'
import InterviewController from '../http/controllers/interview.controller.js';
import InterviewValidation from '../validators/interview.validation.js';

const interviewRouter = express.Router({ mergeParams: true });

interviewRouter
    .get('/', InterviewValidation.index(), InterviewController.index)
    .post('/', InterviewValidation.create(), InterviewController.create)

export default interviewRouter