import express from 'express'
import ProjectController from '../http/controllers/project.controller.js';
import ProjectValidation from '../validators/project.validation.js'

const projectRouter = express.Router();

projectRouter
    .get('/', ProjectValidation.index(), ProjectController.index)
    .get('/:id', ProjectValidation.find(), ProjectController.find)
    .post('/', ProjectValidation.create(), ProjectController.create)
    .patch('/:id', ProjectValidation.update(), ProjectController.update)
    .delete('/:id', ProjectValidation.remove(), ProjectController.delete)
    .patch('/:id/manager', ProjectValidation.manager(), ProjectController.manager)
    .delete('/:id/manager', ProjectValidation.deleteManager(), ProjectController.deleteManager)
    .get('/:id/resumes', ProjectValidation.find(), ProjectController.getResumes)

export default projectRouter