import express from 'express'

import { index, create } from '../validators/permission.validation.js'
import PermissionController from '../http/controllers/permission.controller.js'

const permissionRouter = express.Router();

permissionRouter
    .get('/', index, PermissionController.index)
    .post('/', create, PermissionController.create)

export default permissionRouter;