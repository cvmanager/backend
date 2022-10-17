import NotFoundError from '../../exceptions/NotFoundError.js';
import Project from '../../models/project.model.js';
import AppResponse from '../../helper/response.js';
import Controller from './controller.js';

class ProjectController extends Controller {

    async index(req, res, next) {
        try {
            const { page = 1, size = 10, query = '' } = req.query
            let searchQuery = {}
            if (query.length > 0) {
                searchQuery = {
                    $or: [
                        { name: { '$regex': query } },
                        { description: { '$regex': query } }
                    ]
                }
            }
            let projectList = await Project
                .find(searchQuery)
                .limit(size)
                .skip(size * (page - 1));
            AppResponse.builder(res).message("project.message.project_found").data(projectList).send();
        } catch (err) {
            next(err);
        }
    }

    async find(req, res, next) {
        try {
            let project = await Project.findById(req.params.id).exec();
            if (!project) throw new NotFoundError('project.error.project_notfound');

            AppResponse.builder(res).message("project.message.project_found").data(project).send();
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            req.body.created_by = req.user_id;
            let project = await Project.create(req.body);
            AppResponse.builder(res).status(201).message("project.message.project_successfuly_created").data(project).send();
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(project => AppResponse.builder(res).message("project.message.project_successfuly_updated").data(project).send())
                .catch(err => next(err));
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            let project = await Project.findById(req.params.id);
            if (!project) throw new NotFoundError('project.error.project_notfound');
            await project.delete(req.user_id);
            AppResponse.builder(res).message("project.message.project_successfuly_deleted").data(project).send();
        } catch (err) {
            next(err);
        }
    }
}

export default new ProjectController;