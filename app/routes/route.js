const router = require('express').Router();

const projectRouting = require('./project-route');

router.use('/projects', projectRouting);


module.exports = router;