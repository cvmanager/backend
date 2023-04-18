import express from 'express'
import InterviewController from '../http/controllers/interview.controller.js';
import InterviewValidation from '../validators/interview.validation.js';

const interviewIdRouter = express.Router({ mergeParams: true });

interviewIdRouter
    .get('/', InterviewValidation.find(), InterviewController.find)
    .patch('/', InterviewValidation.update(), InterviewController.update)
    .delete('/', InterviewValidation.remove(), InterviewController.delete)

export default interviewIdRouter