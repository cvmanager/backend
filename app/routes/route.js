const router = require('express').Router()
const { verifyToken } = require('../middlewares/auth.middleware')
const projectRouting = require('./project.route')
const resumeRouting = require('./resume.route')
const authRouting = require('./auth.route')

router.use('/auth', authRouting)
router.use('/projects', verifyToken, projectRouting)
router.use('/resumes', verifyToken, resumeRouting)


module.exports = router;