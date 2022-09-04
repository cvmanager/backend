const router = require('express').Router()
const ProjectController = require('../http/controller/projectController');

router.post('/', ProjectController.create);

router.get('/', ProjectController.get)
router.get('/:projectId', ProjectController.find)

module.exports = router