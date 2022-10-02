import { validationResult, param, body } from 'express-validator';
import BadRequestError from '../exceptions/BadRequestError.js';

const find = [
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

const updateProfileImage = [
    body('avatar')
        .notEmpty().withMessage('avatar is required')
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


export {find,updateProfileImage}