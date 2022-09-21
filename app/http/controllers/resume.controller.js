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

    async index(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query
            let searchQuery = {}
            if (query.length > 0) {
                searchQuery = {
                    $or: [
                        { firstname: { '$regex': query } },
                        { lastname: { '$regex': query } },
                        { gender: { '$regex': query } },
                        { email: { '$regex': query } },
                        { marital_status: { '$regex': query } },
                        { resume_status: { '$regex': query } },
                        { mobile: { '$regex': query } },
                        { residence_city: { '$regex': query } },
                        { work_city: { '$regex': query } },
                        { education: { '$regex': query } },
                        { major: { '$regex': query } },
                        { phone: { '$regex': query } },
                        { military_status: { '$regex': query } }
                    ]
                }
            }
            let allResumes = await Resume
                .find(searchQuery)
                .limit(size)
                .skip(size * (page - 1));
            AppResponse.builder(res).message("Succussfully Founded!").data(allResumes).send();
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            let resumeId = req.params.id;
            Resume.findByIdAndUpdate(resumeId, req.body, { new: true }, function (err, newResume) {
                AppResponse.builder(res).message("Succussfully Founded!").data(newResume).send();
            });
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        const resume_id = req.params.id;
        try {
            let resume = await Resume.findById(resume_id);
            if (!resume) {
                throw new NotFoundError('Resume Not Found');
            }
            resume.deleted_at = Date.now();
            resume.deleted_by = req.user_id;

            await resume.save();
            AppResponse.builder(res).message("Succussfully Deleted!").data(resume).send();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ResumeController;