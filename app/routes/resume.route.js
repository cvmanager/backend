const router = require('express').Router()
const ResumeController = require('../http/controllers/resume.controller');
const resumeValidation = require('../validators/resume.validation')


router
    .get('/', ResumeController.index)
    .get('/:id', ResumeController.find)
    .post('/', resumeValidation.resume_create, ResumeController.create)
    .patch('/:id/status', resumeValidation.checkStatus, ResumeController.updateStatus)
    .patch('/:id', resumeValidation.resume_update, ResumeController.update)
    .delete('/:id', ResumeController.delete)

module.exports = router