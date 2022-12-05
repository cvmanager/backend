import express from 'express'
import PositionValidation from '../validators/position.validation.js'
import PositionController from '../http/controllers/position.controller.js'

const positionRouter = express.Router();

positionRouter
    .post('/', PositionValidation.create(), PositionController.create)

export default positionRouter;