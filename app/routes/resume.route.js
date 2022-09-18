const router = require('express').Router()
const ResumeController = require('../http/controllers/resume.controller');
const resumeValidation = require('../validators/resume.validation')

router.post('/', resumeValidation.resume_create, ResumeController.create);

module.exports = router