import express from 'express'
import ResumeController from '../http/controllers/resume.controller.js';
import ResumeValidation from '../validators/resume.validation.js';
import { Upload } from '../helper/upload.js';
import { toLowerCase } from '../middlewares/lowerCase.middleware.js';
import ResumeInterviewValidation from '../validators/resumeInterview.validation.js'
import ResumeInterviewController from '../http/controllers/resumeInterview.controller.js'
const resumeIdRouter = express.Router({ mergeParams: true });

resumeIdRouter
    .get('', ResumeValidation.find(), ResumeController.find)
    .patch('', ResumeValidation.update(), toLowerCase, ResumeController.update)
    .delete('', ResumeValidation.remove(), ResumeController.delete)
    .patch('/status', ResumeValidation.update_status(), ResumeController.updateStatus)
    .patch('/call-history', ResumeValidation.call_history(), ResumeController.callHistory)
    .patch('/file', Upload('resumes', 'file', 'file'), ResumeValidation.upload_file(), ResumeController.uploadFile)
    .get('/comments', ResumeValidation.comments(), ResumeController.comments)
    .patch('/avatar', Upload('resumes', 'avatar', 'image'), ResumeValidation.avatar(), ResumeController.updateAvatar)
    .patch('/comments', ResumeValidation.addComments(), ResumeController.addComments)

    .patch('/assigners', ResumeValidation.setAssigner(), ResumeController.setAssigner)
    .delete('/assigners', ResumeValidation.unsetAssigner(), ResumeController.unsetAssigner)
    .patch('/tags', ResumeValidation.set_tag(), ResumeController.setTag)
    .delete('/tags', ResumeValidation.unset_tag(), ResumeController.unsetTag)
    .patch('/hired', ResumeValidation.hired(), ResumeController.hired)
    .patch('/reject', ResumeValidation.reject(), ResumeController.reject)
    .patch('/end-cooperation', ResumeValidation.end_cooperation(), ResumeController.endCooperation)

    .patch('/skills', ResumeValidation.set_skill(), ResumeController.setSkill)
    .delete('/skills', ResumeValidation.unset_skill(), ResumeController.unsetSkill)

    .get('/interviews', ResumeInterviewValidation.index(), ResumeInterviewController.index)
    .post('/interviews', ResumeInterviewValidation.create(), ResumeInterviewController.create)
    .get('/interviews/:interview_id', ResumeInterviewValidation.find(), ResumeInterviewController.find)
    .patch('/interviews/:interview_id', ResumeInterviewValidation.update(), ResumeInterviewController.update)
    .delete('/interviews/:interview_id', ResumeInterviewValidation.remove(), ResumeInterviewController.delete)


export default resumeIdRouter