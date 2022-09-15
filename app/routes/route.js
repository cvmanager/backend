const router = require('express').Router();

const projectRouting = require('./project-route');
const authRouting = require('./auth-route');

router.use('/auth', authRouting);
router.use('/projects', projectRouting);


module.exports = router;