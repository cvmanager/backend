import express from 'express'
import PositionValidation from '../validators/position.validation.js'
import PositionController from '../http/controllers/position.controller.js'

const positionRouter = express.Router();

positionRouter
    .get('/', PositionController.index)
    .get('/:id', PositionValidation.find(), PositionController.find)
    .post('/', PositionValidation.create(), PositionController.create)
    .delete('/:id', PositionValidation.remove(), PositionController.delete)

export default positionRouter;