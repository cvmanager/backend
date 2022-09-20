const Controller = require('./controller');
const Resume = require('../../models/resume.model')
const Project = require('../../models/project.model')
const NotFoundError = require('../../exceptions/NotFoundError');
const AppResponse = require('../../helper/response');

class ResumeController extends Controller {
    async create(req, res, next) {
        try {
            const projectId = req.body.project_id
            if (projectId.match(/^[0-9a-fA-F]{24}$/)) {
                let project = await Project.findById(projectId);
                if (!project) {
                    throw new NotFoundError('Project Not Found');
                }
                req.body.created_by = req.user_id
                req.body.resume_status = 'pending'
                let resume = await Resume.create(req.body)
                AppResponse.builder(res).status(201).message("Succussfully Created!").data(resume).send();
            } else {
                throw new BadRequestError("Project Id Is Not Valid!")
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ResumeController;