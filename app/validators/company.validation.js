import { body, param } from 'express-validator'

import generalValidator from '../helper/validator.js';

const create = [
    body('name')
        .notEmpty()
            .withMessage('company.validation.company_name_required')
        .isLength({ min: 3, max: 50 })
            .withMessage('company.validation.company_name_length')
        .trim(),
    generalValidator
];

const find = [
    param('id')
        .notEmpty()
            .withMessage('company.validation.company_id_required')
        .isMongoId()
            .withMessage('company.validation.company_id_invalid')
        .trim(),
    generalValidator
];

const update = [
    param('id')
        .notEmpty()
            .withMessage('company.validation.company_id_required')
        .isMongoId()
            .withMessage('company.validation.company_id_invalid')
        .trim(),
    body('name')
        .isLength({ min: 1, max: 50 })
            .withMessage('company.validation.company_name_length')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    generalValidator
];

const remove = [
    param('id')
        .notEmpty()
            .withMessage('company.validation.company_id_required')
        .isMongoId()
            .withMessage('company.validation.company_id_invalid')
        .trim(),
    generalValidator
];

export { create, find, update, remove }