const router = require('express').Router()
const ProjectController = require('../http/controller/project-controller');
const projectValidation = require('../validators/project-validation')

router.post('/', projectValidation.project_create_check, ProjectController.create);
router.patch('/:d', projectValidation.project_update_check, ProjectController.update);

router.get('/', ProjectController.get)
router.get('/:id', ProjectController.find)
router.delete('/:id', ProjectController.delete)

module.exports = router