const router = require('express').Router();
const { verifyToken } = require('../middleware/auth.middleware');
const projectRouting = require('./project.route');
const authRouting = require('./auth.route');

router.use('/auth', authRouting);
router.use('/projects', verifyToken, projectRouting);


module.exports = router;