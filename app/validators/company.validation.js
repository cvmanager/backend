import { body, validationResult, param } from 'express-validator'
import BadRequestError from '../exceptions/BadRequestError.js';

const create = [
    body('name')
        .notEmpty().withMessage('name is require')
        .isLength({ min: 3, max: 50 }).withMessage('company name should not be empty, should be more than one and less than 3 character')
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

const find = [
    param('id')
        .notEmpty().withMessage('company id  is require')
        .isMongoId().withMessage('company id invalid!')
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

const update = [
    param('id')
        .notEmpty().withMessage('company id  is require')
        .isMongoId().withMessage('company id invalid!')
        .trim(),
    body('name')
        .isLength({ min: 1, max: 50 }).withMessage('name should not be empty, should be more than one and less than 50 character')
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

const remove = [
    param('id')
        .notEmpty().withMessage('company id is required')
        .isMongoId().withMessage('company id invalid')
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

export { create, find, update, remove }