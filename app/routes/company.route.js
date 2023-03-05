import express from 'express'

import CompanyValidation from '../validators/company.validation.js'
import CompanyController from '../http/controllers/company.controller.js'

const companyRouter = express.Router();


companyRouter
    .get('', CompanyValidation.index(), CompanyController.index)
    .post('', CompanyValidation.create(), CompanyController.create)
export default companyRouter;