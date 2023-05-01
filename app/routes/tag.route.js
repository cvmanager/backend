import express from 'express'

import TagController from '../http/controllers/tag.controller.js';

const TagRouter = express.Router();
TagRouter
    .get('/', TagController.index)
export default TagRouter
