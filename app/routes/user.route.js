const router = require('express').Router()
const UserController = require('../http/controllers/user.controller');
const userValidation = require('../validators/resume.validation')

router
    .get('/', UserController.index)
    .get('/:id', userValidation.find, UserController.find)
    .patch('/:d', userValidation.update, UserController.update)
    .delete('/:id', userValidation.delet, UserController.delete)


module.exports = router