const { body, validationResult } = require('express-validator');
const BadRequestError = require('../exceptions/BadRequestError');


exports.signup = [
    body('firstname')
        .notEmpty().withMessage('firstname is require')
        .isLength({ min: 3, max: 80 }).withMessage('first name should not be empty, should be more than one and less than 3 character')
        .trim(),
    body('lastname')
        .notEmpty().withMessage('lastname is require')
        .isLength({ min: 3, max: 80 }).withMessage('last name should not be empty, should be more than one and less than 3 character')
        .trim(),
    body('mobile')
        .notEmpty().withMessage('mobile is require')
        .isMobilePhone().withMessage('mobile number is invalid!')
        .trim(),
    body('password')
        .notEmpty().withMessage('password is require')
        .isLength({ min: 8, max: 10 }).withMessage('password should not be empty, should be more than one and between 8 - 10  character')
        .trim(),
    body('password_confirm')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match with password')
            }
            return true;
        })
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
    body('password')
        .notEmpty().withMessage('password is require')
        .isLength({ min: 8, max: 10 }).withMessage('password should not be empty, should be more than one and between 8 - 10  character')
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