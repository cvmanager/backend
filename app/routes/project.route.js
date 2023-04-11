import express from 'express'
import ProjectController from '../http/controllers/project.controller.js';
import ProjectValidation from '../validators/project.validation.js'

const projectRouter = express.Router();

projectRouter
    .get('/', ProjectValidation.index(), ProjectController.index)
    .post('/', ProjectValidation.create(), ProjectController.create)
export default projectRouter