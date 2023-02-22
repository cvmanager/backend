import express from 'express'
import PositionValidation from '../validators/position.validation.js'
import PositionController from '../http/controllers/position.controller.js'
import { Upload } from '../helper/upload.js';

const positionRouter = express.Router();

positionRouter
    .get('/', PositionValidation.index(), PositionController.index)
    .get('/:id', PositionValidation.find(), PositionController.find)
    .post('/', PositionValidation.create(), PositionController.create)
    .patch('/:id', PositionValidation.update(), PositionController.update)
    .patch('/:id/manager', PositionValidation.manager(), PositionController.manager)
    .delete('/:id', PositionValidation.remove(), PositionController.delete)
    .get('/:id/managers', PositionValidation.find(), PositionController.getManagers)
    .get('/:id/resumes', PositionValidation.find(), PositionController.getResumes)
    .patch('/:id/active', PositionValidation.active(), PositionController.active)
    .patch('/:id/deactive', PositionValidation.deActive(), PositionController.deActive)
    .patch('/:id/logo', Upload('positions', 'logo', 'image'), PositionValidation.logo(), PositionController.updateLogo)

export default positionRouter;