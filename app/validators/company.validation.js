import { body, param } from 'express-validator'

import generalValidator from '../helper/validator.js';

const create = [
    body('name')
        .notEmpty()
            
            .withMessage('company.validator.name_require')
        .isLength({ min: 3, max: 50 })
            .withMessage('company.validator.name_length')
        .trim(),
    generalValidator
];

const find = [
    param('id')
        .notEmpty()
            .withMessage('company.validator.id_require')
        .isMongoId()
            .withMessage('company.validator.id_invalid')
        .trim(),
    generalValidator
];

const update = [
    param('id')
        .notEmpty()
            .withMessage('company.validator.id_require')
        .isMongoId()
            .withMessage('company.validator.id_invalid')
        .trim(),
    body('name')
        .isLength({ min: 1, max: 50 })
            .withMessage('company.validator.name_length')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    generalValidator
];

const remove = [
    param('id')
        .notEmpty()
            .withMessage('company.validator.id_require')
        .isMongoId()
            .withMessage('company.validator.id_invalid')
        .trim(),
    generalValidator
];

export { create, find, update, remove }