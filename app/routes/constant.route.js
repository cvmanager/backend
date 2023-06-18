import express from 'express'
import ConstantController from '../http/controllers/constant.controller.js'

const constantRouter = express.Router();

constantRouter
    .get('/', ConstantController.index)
export default constantRouter;