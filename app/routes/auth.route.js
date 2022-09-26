const router = require('express').Router();
const authController = require('../http/controllers/auth.controller');
const AuthValidation = require('../validators/auth.validation');
const { verifyRefrshToken, verifyToken } = require('../middlewares/auth.middleware')

router
    .post('/signup', AuthValidation.signup, authController.signup)
    .post('/login', AuthValidation.login, authController.login)
    .post('/logout', verifyToken, authController.logout)
    .post('/refresh', verifyRefrshToken, authController.refresh)
    .post('/verify-token',verifyToken,auth.verifyToken)

module.exports = router;