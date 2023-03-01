import express from 'express'

import { find, update, remove } from '../validators/permission.validation.js'
import PermissionController from '../http/controllers/permission.controller.js'

const permissionIdRouter = express.Router({ mergeParams: true });

permissionIdRouter
    .get('', find, PermissionController.find)
    .patch('', update, PermissionController.update)
    .delete('', remove, PermissionController.delete)

export default permissionIdRouter;