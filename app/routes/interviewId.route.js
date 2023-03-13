import express from 'express'
import InterviewController from '../http/controllers/interview.controller.js';
import InterviewValidation from '../validators/interview.validation.js';

const interviewIdRouter = express.Router();

interviewIdRouter
    .get('/:id', InterviewValidation.find(), InterviewController.find)
    .patch('/:id', InterviewValidation.update(), InterviewController.update)
    .delete('/:id', InterviewValidation.remove(), InterviewController.delete)

export default interviewIdRouter