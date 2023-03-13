import express from 'express'
import ResumeController from '../http/controllers/resume.controller.js';
import ResumeValidation from '../validators/resume.validation.js';
import { Upload } from '../helper/upload.js';

const resumeIdRouter = express.Router({mergeParams: true});

resumeIdRouter
    .get('', ResumeValidation.find(), ResumeController.find)
    .patch('', ResumeValidation.update(), ResumeController.update)
    .delete('', ResumeValidation.remove(), ResumeController.delete)
    .patch('/status', ResumeValidation.update_status(), ResumeController.updateStatus)
    .post('/call-history', ResumeValidation.call_history(), ResumeController.callHistory)
    .patch('/file', Upload('resumes', 'file', 'file'), ResumeValidation.upload_file(), ResumeController.uploadFile)
    .get('/comments', ResumeValidation.comments(), ResumeController.comments)
    .post('/comments', ResumeValidation.addComments(), ResumeController.addComments)

export default resumeIdRouter