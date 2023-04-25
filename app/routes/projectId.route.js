import express from 'express'
import { Upload } from '../helper/upload.js';
import ProjectController from '../http/controllers/project.controller.js';
import ProjectValidation from '../validators/project.validation.js'
import { banUserCantSetForManager } from '../middlewares/manager.middleware.js'
import { convertProjectFieldToLowerCase } from '../middlewares/lowerCase.middleware.js';

const projectIdRouter = express.Router({ mergeParams: true });

projectIdRouter
    .get('', ProjectValidation.find(), ProjectController.find)
    .patch('', ProjectValidation.update(), convertProjectFieldToLowerCase, ProjectController.update)
    .delete('', ProjectValidation.remove(), ProjectController.delete)
    .patch('/manager', ProjectValidation.manager(), banUserCantSetForManager, ProjectController.manager)
    .delete('/manager', ProjectValidation.deleteManager(), ProjectController.deleteManager)
    .get('/resumes', ProjectValidation.find(), ProjectController.getResumes)
    .get('/managers', ProjectValidation.find(), ProjectController.getManagers)
    .get('/positions', ProjectValidation.find(), ProjectController.getPositions)
    .patch('/active', ProjectValidation.active(), ProjectController.active)
    .patch('/deactive', ProjectValidation.deActive(), ProjectController.deActive)
    .patch('/logo', Upload('projects', 'logo', 'image'), ProjectValidation.logo(), ProjectController.updateLogo)
export default projectIdRouter