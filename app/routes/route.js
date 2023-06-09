import express from 'express'
import { verifyToken, checkUserState } from '../middlewares/auth.middleware.js'
import projectRouter from './project.route.js'
import resumeRouter from './resume.route.js'
import authRouter from './auth.route.js'
import userRouter from './user.route.js'
import TagRouter from './tag.route.js'
import companyRouter from './company.route.js'
import constantRouter from './constant.route.js'
import provinceRouter from './province.route.js'
import cityRouter from './city.route.js'
import positionRouter from './position.route.js'
import { canAccess } from '../middlewares/rbac.middleware.js'
import userIdRouter from './userId.route.js';
import { userAccess } from '../middlewares/userAccess.middleware.js'
import companyIdRouter from './companyId.route.js'
import { companyAccess } from '../middlewares/companyAccess.middleware.js'
import projectIdRouter from './projectId.route.js'
import { projectAccess } from '../middlewares/projectAccess.middleware.js'
import permissionRouter from './permission.route.js'
import permissionIdRouter from './permissionId.route.js'
import roleIdRouter from './roleId.route.js'
import roleRouter from './role.route.js'
import { positionAccess } from '../middlewares/positionAccess.middleware.js'
import positionIdRouter from './positionId.router.js'
import { resumeAccess } from '../middlewares/resumeAccess.middleware.js'
import resumeIdRouter from './resumeId.route.js'
import provinceIdRouter from './provinceId.route.js'
import profileRouter from './profile.route.js'


const router = express.Router({ mergeParams: true });

router.use('/auth', authRouter)

router.use('/cities', verifyToken, checkUserState, canAccess, cityRouter)

router.use('/companies/:id', verifyToken, checkUserState, canAccess, companyAccess, companyIdRouter)
router.use('/companies', verifyToken, checkUserState, canAccess, companyAccess, companyRouter)

router.use('/users/:id', verifyToken, canAccess, userAccess, userIdRouter)
router.use('/users', verifyToken, checkUserState, canAccess, userRouter)

router.use('/constant', verifyToken, constantRouter)

router.use('/permissions/:id', verifyToken, checkUserState, canAccess, permissionIdRouter)
router.use('/permissions', verifyToken, checkUserState, canAccess, permissionRouter)

router.use('/positions/:id', verifyToken, checkUserState, canAccess, positionAccess, positionIdRouter)
router.use('/positions', verifyToken, checkUserState, canAccess, positionAccess, positionRouter)

router.use('/projects/:id', verifyToken, checkUserState, canAccess, projectAccess, projectIdRouter)
router.use('/projects', verifyToken, checkUserState, canAccess, projectAccess, projectRouter)

router.use('/provinces/:id', verifyToken, provinceIdRouter)
router.use('/provinces', verifyToken, provinceRouter)


router.use('/resumes/:id', verifyToken, checkUserState, canAccess, resumeAccess, resumeIdRouter)
router.use('/resumes', verifyToken, checkUserState, canAccess, resumeAccess, resumeRouter)

router.use('/roles/:id', verifyToken, checkUserState, canAccess, roleIdRouter)
router.use('/roles', verifyToken, checkUserState, canAccess, roleRouter)

router.use('/tags', verifyToken, checkUserState, canAccess, TagRouter)

router.use('/profile', verifyToken, profileRouter);




export default router;