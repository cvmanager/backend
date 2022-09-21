const Controller = require('./controller');
const Resume = require('../../models/resume.model')
const Project = require('../../models/project.model')
const NotFoundError = require('../../exceptions/NotFoundError');
const AppResponse = require('../../helper/response');

class ResumeController extends Controller {
    
    async index(req, res, next) {
        try {
            const { page = 1, size = 10, q: query = '' } = req.query
            let searchQuery = {}
            if (query.length > 0) {
                searchQuery = {
                    $or: [
                        { firstname: { '$regex': query } },
                        { lastname: { '$regex': query } },
                        { email: { '$regex': query } },
                        { mobile: { '$regex': query } },
                        { residence_city: { '$regex': query } },
                        { work_city: { '$regex': query } },
                        { education: { '$regex': query } },
                        { major: { '$regex': query } },
                        { phone: { '$regex': query } },
                    ]
                }
            }
            let resumeList = await Resume
                .find(searchQuery)
                .limit(size)
                .skip(size * (page - 1));
            AppResponse.builder(res).message("succussfully founded!").data(resumeList).send();
        } catch (err) {
            next(err);
        }
    }

    async find(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id);
            if (!resume) throw new NotFoundError('resume not found');

            AppResponse.builder(res).message("resume found successfully").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            let project = await Project.findById(req.body.project_id);
            if (!project) throw new NotFoundError('Project Not Found');

            req.body.created_by = req.user_id
            req.body.resume_status = 'pending'
            let resume = await Resume.create(req.body)
            AppResponse.builder(res).status(201).message("resume was successfully found and created").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(resume => AppResponse.builder(res).message("the resume has been successfully updated").data(resume).send())
                .catch(err => next(err));
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            let resume = await Resume.findById(req.params.id);
            if (!resume) throw new NotFoundError('resume not found');
            resume.deleted_at = Date.now();
            resume.deleted_by = req.user_id;

            await resume.save();
            AppResponse.builder(res).message("resume successfully deleted").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    async updateStatus(req, res, next) {
        try {
            await Resume.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
                .then(resume => AppResponse.builder(res).message("the resume status has been successfully updated").data(resume).send())
                .catch(err => next(err));
        } catch (err) {
            next(err);
        }
    }

}

module.exports = new ResumeController;