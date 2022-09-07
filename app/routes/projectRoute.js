const router = require('express').Router()
const ProjectController = require('../http/controller/projectController');
const projectValidation = require('../validators/projectValidation')

router.post('/', projectValidation.project_create_check, ProjectController.create);

router.get('/', ProjectController.get)
router.get('/:projectId', ProjectController.find)

module.exports = router