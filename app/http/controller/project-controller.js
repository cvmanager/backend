const controller = require('./controller');
const Project = require('../../model/Project')
const { validationResult } = require('express-validator');
const { success, error } = require('../../helper/responseApi')
const NotFoundError = require('../../middleware/NotFoundError');
const AppResponse = require('../../helper/response');
class ProjectController extends controller {

    async get(req, res, next) {
        try {
            const { page = 1, size = 1 } = req.query
            let allProjects = await Project
                .find()
                .limit(size)
                .skip(size * (page - 1));
            AppResponse.builder(res).message("Succussfully Founded!").data(allProjects).send();
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        let newProject = Project(req.body)
        try {
            await newProject.save();
            AppResponse.builder(res).message("Succussfully Created!").data(newProject).send();
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
        try {
            let project = await Project.findById(req.params.id);
            if (!project) {
                throw new NotFoundError('Project Not Found');
            }
            await project.delete()
            AppResponse.builder(res).message("Succussfully Deleted!").data(project).send();
        } catch (err) {
            next(err);
        }
    }

    async find(req, res, next) {
        try {
            let project = await Project.findById(req.params.id);
            if (!project) {
                throw new NotFoundError('Project Not Found');
            }
            AppResponse.builder(res).message("Succussfully Founded!").data(project).send();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ProjectController;