const router = require('express').Router()
const UserController = require('../http/controllers/user.controller');
const userValidation = require('../validators/user.validation')
const uploadProfileImage = require('../helper/upload');
router
    .get('/', UserController.index)
    .get('/:id', userValidation.find, UserController.find)
    .patch('/update-profile-image/:id', userValidation.updateProfileImage, uploadProfileImage.single('image'), UserController.uploadProfileImage)

module.exports = router