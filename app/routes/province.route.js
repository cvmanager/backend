import express from 'express'
import ProvinceController from '../http/controllers/province.controller.js'
import ProvinceValidation from '../validators/province.validation.js'

const provinceRouter = express.Router();

provinceRouter
    .get('/', ProvinceValidation.index(), ProvinceController.index)

export default provinceRouter;