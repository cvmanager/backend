import express from 'express'
import ProvinceController from '../http/controllers/province.controller.js'
import ProvinceValidation from '../validators/province.validation.js'

const provinceIdRouter = express.Router({ mergeParams: true });

provinceIdRouter
    .get('', ProvinceValidation.find(), ProvinceController.find)
export default provinceIdRouter