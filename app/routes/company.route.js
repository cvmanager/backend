import express from 'express'

import CompanyValidation from '../validators/company.validation.js'
import CompanyController from '../http/controllers/company.controller.js'
import { convertCompanyFieldToLowerCase } from '../middlewares/lowerCase.middleware.js';

const companyRouter = express.Router();


companyRouter
    .get('', CompanyValidation.index(), CompanyController.index)
    .post('', CompanyValidation.create(), convertCompanyFieldToLowerCase, CompanyController.create)
export default companyRouter;