const router = require('express').Router();
const CompanyValidation = require('../validators/company.validation');
const CompanyController = require('../http/controllers/company.controller')


router
    .get('/', CompanyController.index)
    .get('/:id', CompanyValidation.find, CompanyController.find)
    .post('/', CompanyValidation.create, CompanyController.create)
    .patch('/:id', CompanyValidation.update, CompanyController.update)
    .delete('/:id', CompanyValidation.delete, CompanyController.delete)

module.exports = router;