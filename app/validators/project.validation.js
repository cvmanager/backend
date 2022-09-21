const { body, validationResult } = require('express-validator');
const BadRequestError = require('../exceptions/BadRequestError');
exports.create = [
    body('name')
        .notEmpty().withMessage('name is require')
        .isLength({ min: 3, max: 50 }).withMessage('project name should not be empty, should be more than one and less than 3 character')
        .trim(),
    body('description')
        .notEmpty().withMessage('description is require')
        .isLength({ min: 10, max: 100 }).withMessage('project description should not be empty, should be more than one and less than 3 character')
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

exports.update = [
    body('name')
        .isLength({ min: 1, max: 50 }).withMessage('name should not be empty, should be more than one and less than 50 character')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    body('description')
        .isLength({ min: 10 }).withMessage('des min 10 char')
        .optional({ nullable: true, checkFalsy: true })
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

exports.find = [
    param('id')
        .notEmpty().withMessage('project id is required')
        .isMongoId().withMessage('project id invalid')
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

exports.delete = [
    param('id')
        .notEmpty().withMessage('project id is required')
        .isMongoId().withMessage('project id invalid')
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
