const router = require('express').Router();
const Project = require('../model/Project');
router.post('/', async (req, res) => {
    await Project.create({
        name: req.body.name,
        description: req.body.description,
    }).then(item => {
        return res.json({ status: true, message: 'project successful saved!', data: [item] }).statusCode(200);
    }).catch(err => {
        return res.json({ status: false, message: '', data: [] }).statusCode(500);
    })
});

module.exports = router;