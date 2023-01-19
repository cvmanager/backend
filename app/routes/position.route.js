import express from 'express'
import PositionValidation from '../validators/position.validation.js'
import PositionController from '../http/controllers/position.controller.js'

const positionRouter = express.Router();

positionRouter
    .get('/', PositionValidation.index(), PositionController.index)
    .get('/:id', PositionValidation.find(), PositionController.find)
    .post('/', PositionValidation.create(), PositionController.create)
    .patch('/:id', PositionValidation.update(), PositionController.update)
    .patch('/:id/manager', PositionValidation.manager(), PositionController.manager)
    .delete('/:id', PositionValidation.remove(), PositionController.delete)
    .get('/:id/resumes', PositionValidation.find(), PositionController.getResumes)

export default positionRouter;