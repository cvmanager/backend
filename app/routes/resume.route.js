import express from 'express'
import ResumeController from '../http/controllers/resume.controller.js';
import { create, update, update_status, remove, find } from '../validators/resume.validation.js';

const resumeRouter = express.Router();

resumeRouter
    .get('/', ResumeController.index)
    .get('/:id', find, ResumeController.find)
    .post('/', create, ResumeController.create)
    .patch('/:id', update, ResumeController.update)
    .delete('/:id', remove, ResumeController.delete)
    .patch('/:id/status', update_status, ResumeController.updateStatus)

export default resumeRouter