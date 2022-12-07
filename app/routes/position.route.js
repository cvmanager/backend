import express from 'express'
import PositionValidation from '../validators/position.validation.js'
import PositionController from '../http/controllers/position.controller.js'

const positionRouter = express.Router();

positionRouter
    .get('/', PositionController.index)
    .post('/', PositionValidation.create(), PositionController.create)

export default positionRouter;