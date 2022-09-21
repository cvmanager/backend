const router = require('express').Router()
const ResumeController = require('../http/controllers/resume.controller');
const resumeValidation = require('../validators/resume.validation')

router.post('/', resumeValidation.resume_create, ResumeController.create);
router.patch('/:id', resumeValidation.resume_update, ResumeController.update);

router.get('/', ResumeController.index)
router.get('/:id', ResumeController.find)
router.delete('/:id', ResumeController.delete)

module.exports = router