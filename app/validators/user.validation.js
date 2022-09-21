const { validationResult, param } = require('express-validator');
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