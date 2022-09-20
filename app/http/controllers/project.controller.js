const Controller = require('./controller');
const Project = require('../../models/project.model')
const NotFoundError = require('../../exceptions/NotFoundError');
const AppResponse = require('../../helper/response');
class ProjectController extends Controller {

    async index(req, res, next) {
        try {
            const { page = 1, size = 10, q = '' } = req.query
            let searchQuery = {}
            if (q.length > 0) {
                searchQuery = {
                    $or: [
                        { name: { '$regex': q } },
                        { description: { '$regex': q } }
                    ]
                }
            }
            let allProjects = await Project
                .find(searchQuery)
                .limit(size)
                .skip(size * (page - 1));
            AppResponse.builder(res).message("Succussfully Founded!").data(allProjects).send();
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            let project = await Project.create({
                name: req.body.name,
                description: req.body.description,
                created_by: req.user_id,
            })
            AppResponse.builder(res).status(201).message("Succussfully Created!").data(project).send();
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            let projectId = req.params.id;
            let project = await Project.findById(projectId);
            if (!project) {
                throw new NotFoundError('Project Not Found');
            }
            await Project.updateOne({ id: projectId }, { name: req.body.name }, { description: req.body.description });
            AppResponse.builder(res).message("Succussfully Founded!").data(project).send();
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        const project_id = req.params.id;
        try {
            let project = await Project.findById(project_id);
            if (!project) {
                throw new NotFoundError('Project Not Found');
            }
            project.deleted_at = Date.now();
            project.deleted_by = req.user_id;

            await project.save();
            AppResponse.builder(res).message("Succussfully Deleted!").data(project).send();
        } catch (err) {
            next(err);
        }
    }

    async find(req, res, next) {
        try {
            const projectId = req.params.id
            if (projectId.match(/^[0-9a-fA-F]{24}$/)) {
                let project = await Project.findById(projectId);
                if (!project) {
                    throw new NotFoundError('Project Not Found');
                }
                AppResponse.builder(res).message("Succussfully Founded!").data(project).send();
            } else {
                throw new BadRequestError("Project Id Is Not Valid!")
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ProjectController;