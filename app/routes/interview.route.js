import express from 'express'
import InterviewController from '../http/controllers/interview.controller.js';
import InterviewValidation from '../validators/interview.validation.js';

const interviewRouter = express.Router();

interviewRouter
    .get('/', InterviewValidation.index(), InterviewController.index)
    .get('/:id', InterviewValidation.find(), InterviewController.find)
    .post('/', InterviewValidation.create(), InterviewController.create)
    .patch('/:id', InterviewValidation.update(), InterviewController.update)
    .delete('/:id', InterviewValidation.remove(), InterviewController.delete)

export default interviewRouter