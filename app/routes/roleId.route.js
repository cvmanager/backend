import express from 'express'

import { find, update, remove } from '../validators/role.validation.js'
import RoleController from '../http/controllers/role.controller.js'

const roleIdRouter = express.Router({ mergeParams: true });

roleIdRouter
    .get('', find, RoleController.find)
    .patch('', update, RoleController.update)
    .delete('', remove, RoleController.delete)

export default roleIdRouter;