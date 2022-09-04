const controller = require('./controller');
const Project = require('../../model/Project')
const { validationResult } = require('express-validator');
const { success, error } = require('../../helper/responseApi')

class projectController extends controller {

    async get(req, res) {
        const { page = 1, size = 1 } = req.query

        try {
            let allProjects = await Project
                .find()
                .limit(size)
                .skip(size * (page - 1));
            return res.status(200).json(success("Succussfully Founded!", allProjects))

        } catch (err) {
            let resObj = {
                status: false,
                msg: "Failed",
                errors: [err],
                data: {}
            }

            return res.status(500).json(resObj)
        }
    }

    async create(req, res) {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            let errors = [];
            validationErrors.errors.forEach(errr => {
                errors.push(errr.msg)
            });

            return res.status(422).json(error("validation Error", errors))
        }


        let newProject = Project(req.body)
        try {
            await newProject.save();
            res.status(200).json(success("Succussfully Created", newProject))
        } catch (err) {
            res.status(500).json(error("Server Error", [err]))
        }
    }

    async find(req, res) {
        let projectId = req.params.projectId

        try {
            let project = await Project.findById(projectId);
            if (project) {
                return res.status(200).json(success("Succussfully Founded!", project))
            }
            return res.status(404).json(error("Project Not Found!", []))
        } catch (err) {
            return res.status(500).json(error("Server Error", [err]))
        }
    }
}

module.exports = new projectController;