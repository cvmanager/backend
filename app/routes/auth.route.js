const router = require('express').Router();
const authController = require('../http/controller/auth.controller');
const AuthValidation = require('../validators/auth.validation');
const { verifyRefrshToken } = require('../helper/jwt')


router.post('/signup', AuthValidation.signup, authController.signup)
router.post('/login', AuthValidation.login, authController.login)
router.post('/refresh', verifyRefrshToken, authController.refresh)

module.exports = router;