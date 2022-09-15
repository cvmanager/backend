const router = require('express').Router();
const authController = require('../http/controller/auth-controller');
const AuthValidation = require('../validators/auth-validation');



router.post('/signup' , AuthValidation.signup,authController.signup)
router.post('/login' , AuthValidation.login,authController.login)

module.exports = router;