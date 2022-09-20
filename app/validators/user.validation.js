const { body, validationResult } = require('express-validator');
const BadRequestError = require('../exceptions/BadRequestError');


exports.signup = [
    body('firstname')
        .notEmpty().withMessage('firstname is require')
        .isLength({ min: 3, max: 80 }).withMessage('first name should not be empty, should be more than one and less than 3 character')
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


exports.login = [
    body('mobile')
        .notEmpty().withMessage('mobile is require')
        .isMobilePhone().withMessage('mobile number is invalid!')
        .trim(),
    (req, res, next) => {
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