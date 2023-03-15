import express from 'express'

import { find, update, remove } from '../validators/permission.validation.js'
import permissionController from '../http/controllers/permission.controller.js';

const permissionIdRouter = express.Router({ mergeParams: true });

permissionIdRouter
    .get('', find, permissionController.find)
    .patch('', update, permissionController.update)
    .delete('', remove, permissionController.delete)

export default permissionIdRouter;