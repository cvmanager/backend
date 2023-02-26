import express from 'express'
import { verifyToken } from '../middlewares/auth.middleware.js'
import projectRouter from './project.route.js'
import resumeRouter from './resume.route.js'
import authRouter from './auth.route.js'
import userRouter from './user.route.js'
import companyRouter from './company.route.js'
import constantRouter from './constant.route.js'
import provinceRouter from './province.route.js'
import cityRouter from './city.route.js'
import positionRouter from './position.route.js'
import { canAccess } from '../middlewares/rbac.middleware.js'
import companyIdRouter from './companyId.route.js'

const router = express.Router();

router.use('/auth', authRouter)
router.use('/users', verifyToken, userRouter)
router.use('/companies/:id', verifyToken, canAccess, companyIdRouter)
router.use('/companies', verifyToken, canAccess, companyRouter)
router.use('/projects', verifyToken, projectRouter)
router.use('/resumes', verifyToken, resumeRouter)
router.use('/constant', verifyToken,constantRouter)
router.use('/provinces', verifyToken,provinceRouter)
router.use('/cities', verifyToken,cityRouter)
router.use('/positions', verifyToken,positionRouter)

export default router;