import express from 'express'

import TagController from '../http/controllers/tag.controller.js';
import TagValidation from '../validators/tag.validation.js';


const TagRouter = express.Router();
TagRouter
    .get('/', TagController.index)
    .post('/', TagValidation.create(), TagController.create)
export default TagRouter
