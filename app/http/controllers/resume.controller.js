const Controller = require('./controller');
const Resume = require('../../models/resume.model')
const Project = require('../../models/project.model')
const NotFoundError = require('../../exceptions/NotFoundError');
const AppResponse = require('../../helper/response');

class ResumeController extends Controller {
    async create(req, res, next) {
        try {
            let project = await Project.findById(req.body.project_id);
            if (!project) {
                throw new NotFoundError('Project Not Found');
            }
            req.body.created_by = req.user_id
            req.body.resume_status = 'pending'
            let resume = await Resume.create(req.body)
            AppResponse.builder(res).status(201).message("Succussfully Created!").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    async find(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id);
            if (!resume) {
                throw new NotFoundError('Resume Not Found');
            }
            AppResponse.builder(res).message("Succussfully Founded!").data(resume).send();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ResumeController;