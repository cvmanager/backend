import Controller from './controller.js';
import Resume from '../../models/resume.model.js';
import Project from '../../models/project.model.js';
import AppResponse from '../../helper/response.js';
import NotFoundError from '../../exceptions/NotFoundError.js';

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
            let resume = await Resume.findById(req.params.id).populate('Project').exec();
            if (!resume) throw new NotFoundError('resume not found');

            AppResponse.builder(res).message("resume found successfully").data(resume).send();
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            let company = await Company.findById(req.body.company_id);
            if (!company) throw new NotFoundError('company not found');

            let project = await Project.findById(req.body.project_id);
            if (!project) throw new NotFoundError('project not found');

            req.body.created_by = req.user_id
            req.body.status = 'pending'
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

export default new ResumeController;