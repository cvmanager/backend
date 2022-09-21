const router = require('express').Router()
const ResumeController = require('../http/controllers/resume.controller');
const ResumeValidation = require('../validators/resume.validation')


router
    .get('/', ResumeController.index)
    .get('/:id', ResumeValidation.find, ResumeController.find)
    .post('/', ResumeValidation.create, ResumeController.create)
    .patch('/:id', ResumeValidation.update, ResumeController.update)
    .delete('/:id', ResumeValidation.delete, ResumeController.delete)
    .patch('/:id/status', ResumeValidation.update_status, ResumeController.updateStatus)

module.exports = router