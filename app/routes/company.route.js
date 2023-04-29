import express from 'express'

import CompanyValidation from '../validators/company.validation.js'
import CompanyController from '../http/controllers/company.controller.js'
import { companyLowerCase } from '../middlewares/lowerCase.middleware.js';

const companyRouter = express.Router();


companyRouter
    .get('', CompanyValidation.index(), CompanyController.index)
    .post('', CompanyValidation.create(), companyLowerCase, CompanyController.create)
export default companyRouter;