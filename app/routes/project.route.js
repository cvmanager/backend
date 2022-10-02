import express from 'express'
import ProjectController from '../http/controllers/project.controller.js';
import { create, find, update, remove } from '../validators/project.validation.js'

const projectRouter = express.Router();

projectRouter
    .get('/', ProjectController.index)
    .get('/:id', find, ProjectController.find)
    .post('/', create, ProjectController.create)
    .patch('/:id', update, ProjectController.update)
    .delete('/:id', remove, ProjectController.delete)

export default projectRouter