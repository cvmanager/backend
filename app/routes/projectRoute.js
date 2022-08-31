const router = require('express').Router()
const Project = require('../model/Project')

router.post('/', (req, res) => {
    let newProject = Project(req.body)
    try {
        let resObj = {
            status: newProject.save(),
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
});

router.get('/', async (req, res) => {
    let { page, size } = req.query
    if (!page) {
        page = 1
    }
    if (!size) {
        size = 1
    }

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
})

router.get('/:projectId', async (req, res) => {
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
})

module.exports = router