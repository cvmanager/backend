const { validationResult, param,body } = require('express-validator');
const BadRequestError = require('../exceptions/BadRequestError');

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
    // body('image')
    //     .notEmpty().withMessage('image is required')
    //     .trim(),
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
]