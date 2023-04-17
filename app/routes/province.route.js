import express from 'express'
import ProvinceController from '../http/controllers/province.controller.js'

const provinceRouter = express.Router();

provinceRouter
    .get('/', ProvinceController.index)

export default provinceRouter;