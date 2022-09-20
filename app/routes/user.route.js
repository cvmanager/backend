const router = require('express').Router()
const UserController = require('../http/controllers/user.controller');

router.get('/:id', UserController.find)
router.get('/', UserController.index)

module.exports = router