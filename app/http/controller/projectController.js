const controller = require('./controller');
const Project = require('../../model/Project')

class projectController extends controller {

    async get(req,res) {
        const { page = 1, size = 1 } = req.query

        try {
            let allProjects = await Project
                .find()
                .limit(size)
                .skip(size * (page - 1))

            let resObj = {
                status: true,
                msg: "Succussfully Founded!",
                errors: [],
                data: allProjects
            }

            return res.status(200).json(resObj)
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

    async create(req,res){
        let newProject = Project(req.body)
        try {
            let resObj = {
                status: await newProject.save(),
                msg: "Succussfully Created",
                errors: [],
                data: newProject
            }
            res.status(200).json(resObj)
        } catch (err) {
            let resObj = {
                status: false,
                msg: "Failed",
                errors: [err],
                data: {}
            }
            res.status(500).json(resObj)
        }
    }

    async find(req,res){
        let projectId = req.params.projectId

        try {
            let project = await Project
                .findById(projectId)
                
            let resObj = {
                status: true,
                msg: "Succussfully Founded!",
                errors: [],
                data: project
            }
    
            return res.status(200).json(resObj)
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
}

module.exports = new projectController;