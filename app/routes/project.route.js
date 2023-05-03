import express from 'express'
import ProjectController from '../http/controllers/project.controller.js';
import ProjectValidation from '../validators/project.validation.js'
import { toLowerCase } from '../middlewares/lowerCase.middleware.js';

const projectRouter = express.Router();

projectRouter
    .get('/', ProjectValidation.index(), ProjectController.index)
    .post('/', ProjectValidation.create(), toLowerCase, ProjectController.create)
export default projectRouter