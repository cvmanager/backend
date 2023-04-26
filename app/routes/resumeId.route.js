import express from 'express'
import ResumeController from '../http/controllers/resume.controller.js';
import ResumeValidation from '../validators/resume.validation.js';
import { Upload } from '../helper/upload.js';

const resumeIdRouter = express.Router({ mergeParams: true });

resumeIdRouter
    .get('', ResumeValidation.find(), ResumeController.find)
    .patch('', ResumeValidation.update(), ResumeController.update)
    .delete('', ResumeValidation.remove(), ResumeController.delete)
    .patch('/status', ResumeValidation.update_status(), ResumeController.updateStatus)
    .patch('/call-history', ResumeValidation.call_history(), ResumeController.callHistory)
    .patch('/file', Upload('resumes', 'file', 'file'), ResumeValidation.upload_file(), ResumeController.uploadFile)
    .get('/comments', ResumeValidation.comments(), ResumeController.comments)
    .patch('/avatar', Upload('resumes', 'avatar', 'image'), ResumeValidation.avatar(), ResumeController.updateAvatar)
    .patch('/comments', ResumeValidation.addComments(), ResumeController.addComments)
    .patch('/hire_status', ResumeValidation.hireStatus(), ResumeController.hireStatus)
    .patch('/add_contributor', ResumeValidation.addContributor(), ResumeController.addContributor)
    .patch('/remove_contributor', ResumeValidation.removeContributor(), ResumeController.removeContributor)
    .patch('/add_tags', ResumeValidation.addTags(), ResumeController.addTags)
    .patch('/remove_tags', ResumeValidation.removeTags(), ResumeController.removeTags)
    .patch('/reject', ResumeValidation.reject(), ResumeController.reject)

export default resumeIdRouter