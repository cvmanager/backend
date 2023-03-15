import express from 'express'
import PositionValidation from '../validators/position.validation.js'
import PositionController from '../http/controllers/position.controller.js'

const positionIdRouter = express.Router();

positionIdRouter
    .get('', PositionValidation.index(), PositionController.index)
    .post('', PositionValidation.create(), PositionController.create)
    .get('', PositionValidation.find(), PositionController.find)
    .patch('', PositionValidation.update(), PositionController.update)
    .patch('/manager', PositionValidation.manager(), PositionController.manager)
    .delete('', PositionValidation.remove(), PositionController.delete)
    .get('/managers', PositionValidation.find(), PositionController.getManagers)
    .get('/resumes', PositionValidation.find(), PositionController.getResumes)
    .patch('/active', PositionValidation.active(), PositionController.active)
    .patch('/deactive', PositionValidation.deActive(), PositionController.deActive)

export default positionIdRouter;