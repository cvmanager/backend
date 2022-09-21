const router = require('express').Router()
const UserController = require('../http/controllers/user.controller');
const userValidation = require('../validators/user.validation')

router
    .get('/', UserController.index)
    .get('/:id', userValidation.find, UserController.find)

module.exports = router