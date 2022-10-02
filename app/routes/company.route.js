import express from 'express'
import {find,create,update,remove} from '../validators/company.validation.js'
import CompanyController from '../http/controllers/company.controller.js'

const companyRouter = express.Router();


companyRouter
    .get('/', CompanyController.index)
    .get('/:id', find, CompanyController.find)
    .post('/', create, CompanyController.create)
    .patch('/:id', update, CompanyController.update)
    .delete('/:id', remove, CompanyController.delete)

export default companyRouter;