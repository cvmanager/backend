import express from 'express'

import RoleController from '../http/controllers/role.controller.js'
import { create, index } from '../validators/role.validation.js'

const roleRouter = express.Router();

roleRouter
    .get('/', index, RoleController.index)
    .post('/', create, RoleController.create)
    .get('/permissions/rbac', RoleController.rbac)

export default roleRouter;