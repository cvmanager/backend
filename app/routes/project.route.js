const router = require('express').Router()
const ProjectController = require('../http/controllers/project.controller');
const ProjectValidation = require('../validators/project.validation')

router
    .get('/', ProjectController.index)
    .get('/:id', ProjectValidation.find, ProjectController.find)
    .post('/', ProjectValidation.create, ProjectController.create)
    .patch('/:id', ProjectValidation.update, ProjectController.update)
    .delete('/:id', ProjectValidation.delete, ProjectController.delete)

module.exports = router