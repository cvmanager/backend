const router = require('express').Router();
const { verifyToken } = require('../helper/jwt');
const projectRouting = require('./project.route');
const authRouting = require('./auth.route');

router.use('/auth', authRouting);
router.use('/projects', verifyToken, projectRouting);


module.exports = router;