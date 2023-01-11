import express from 'express'
import CompanyValidation from '../validators/company.validation.js'
import CompanyController from '../http/controllers/company.controller.js'

const companyRouter = express.Router();


companyRouter
    .get('/', CompanyValidation.index(), CompanyController.index)
    .get('/:id', CompanyValidation.find(), CompanyController.find)
    .post('/', CompanyValidation.create(), CompanyController.create)
    .patch('/:id', CompanyValidation.update(), CompanyController.update)
    .delete('/:id', CompanyValidation.remove(), CompanyController.delete)
    .patch('/:id/manager', CompanyValidation.manager(), CompanyController.manager)
    .delete('/:id/manager', CompanyValidation.deleteManager(), CompanyController.deleteManager)

export default companyRouter;