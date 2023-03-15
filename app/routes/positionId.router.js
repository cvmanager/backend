import express from 'express'
import PositionValidation from '../validators/position.validation.js'
import PositionController from '../http/controllers/position.controller.js'

const positionIdRouter = express.Router({mergeParams: true});

positionIdRouter
    .get('', PositionValidation.find(), PositionController.find)
    .patch('', PositionValidation.update(), PositionController.update)
    .delete('', PositionValidation.remove(), PositionController.delete)
    .patch('/manager', PositionValidation.manager(), PositionController.manager)
    .get('/managers', PositionValidation.find(), PositionController.getManagers)
    .patch('/active', PositionValidation.active(), PositionController.active)
    .patch('/deactive', PositionValidation.deActive(), PositionController.deActive)
    .get('/resumes', PositionValidation.getResumes(), PositionController.getResumes)

export default positionIdRouter;