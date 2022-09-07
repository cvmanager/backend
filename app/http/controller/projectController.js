const controller = require('./controller');
const Project = require('../../model/Project')
const { validationResult } = require('express-validator');
const { success, error } = require('../../helper/responseApi')
const NotFoundError = require('../../middleware/NotFoundError')
class projectController extends controller {

    async get(req, res, next) {
        const { page = 1, size = 1 } = req.query
        try {
            let allProjects = await Project
                .find()
                .limit(size)
                .skip(size * (page - 1));
            return res.status(200).json(success("Succussfully Founded!", allProjects))

        } catch (err) {
            next(err);
        }
    }

    async create(req, res) {


        let newProject = Project(req.body)
        try {
            await newProject.save();
            res.status(200).json(success("Succussfully Created", newProject))
        } catch (err) {
            next(err);
        }
    }

    async find(req, res, next) {
        let projectId = req.params.projectId
        try {
            let project = await Project.findById(projectId);
            if (!project) {
                throw new NotFoundError('Project Not Found');
            }
            return res.status(200).json(success("Succussfully Founded!", project))
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new projectController;