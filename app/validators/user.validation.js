const { validationResult, param,body } = require('express-validator');
const BadRequestError = require('../exceptions/BadRequestError');
const UserNotFoundError = require('../exceptions/UserNotFoundError');
const User = require('../models/user.model');

exports.find = [
    param('id')
        .notEmpty().withMessage('user id is required')
        .isMongoId().withMessage('user id invalid')
        .trim(),
    function (req, res, next) {
        try {
            var errorValidation = validationResult(req);
            if (!errorValidation.isEmpty()) {
                let validationErr = errorValidation.errors.map(item => item.msg);
                throw new BadRequestError("BadRequest", validationErr);
            }
            next();
        } catch (err) {
            next(err)
        }
    }
];

exports.updateProfileImage = [
    param('id')
        .notEmpty().withMessage('user id is required')
        .isMongoId().withMessage('user id invalid')
        .trim(),
    
    async function (req, res, next) {
        try {
            var errorValidation = validationResult(req);
            if (!errorValidation.isEmpty()) {
                let validationErr = errorValidation.errors.map(item => item.msg);
                throw new BadRequestError("BadRequest", validationErr);
            }
            next();
        } catch (err) {
            next(err)
        }
    }
]