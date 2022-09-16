const router = require('express').Router();
const authController = require('../http/controllers/auth.controller');
const AuthValidation = require('../validators/auth.validation');
const { verifyRefrshToken, verifyToken } = require('../middleware/auth.middleware')


router.post('/signup', AuthValidation.signup, authController.signup)
router.post('/login', AuthValidation.login, authController.login)
router.post('/logout', verifyToken, authController.logout)
router.post('/refresh', verifyRefrshToken, authController.refresh)

module.exports = router;