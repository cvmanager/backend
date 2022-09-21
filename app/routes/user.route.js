const router = require('express').Router()
const UserController = require('../http/controllers/user.controller');
const userValidation = require('../validators/user.validation')

router.get('/:id', userValidation.user_id_check, UserController.find)
router.get('/', UserController.index)

module.exports = router