import express from 'express'
import PositionValidation from '../validators/position.validation.js'
import PositionController from '../http/controllers/position.controller.js'
import { Upload } from '../helper/upload.js';

const positionRouter = express.Router();

positionRouter
    .get('/', PositionValidation.index(), PositionController.index)
    .post('/', PositionValidation.create(), PositionController.create)

export default positionRouter;