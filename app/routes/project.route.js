const router = require('express').Router()
const ProjectController = require('../http/controllers/project.controller');
const projectValidation = require('../validators/project.validation')

router.post('/', projectValidation.project_create_check, ProjectController.create);
router.patch('/:id', projectValidation.project_update_check, ProjectController.update);

router.get('/:id', ProjectController.find)
router.get('/', ProjectController.index)
router.delete('/:id', ProjectController.delete)

module.exports = router