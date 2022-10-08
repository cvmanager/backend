import { body, param } from 'express-validator';

import generalValidator from '../helper/validator.js';

const create = [
    body('company_id')
        .notEmpty()
            .withMessage('company.validator.id_require')
        .isMongoId()
            .withMessage('company.validator.id_invalid')
        .trim(),
    body('name')
        .notEmpty()
            .withMessage('project.validator.name_require')
        .isLength({ min: 3, max: 50 })
            .withMessage('project.validator.name_length')
        .trim(),
    body('description')
        .notEmpty()
            .withMessage('project.validator.description_require')
        .isLength({ min: 10, max: 100 })
            .withMessage('project.validator.name_length')
        .trim(),
    generalValidator
];

const update = [
    body('name')
        .isLength({ min: 1, max: 50 })
            .withMessage('project.validator.name_length')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    body('description')
        .isLength({ min: 10 })
            .withMessage('project.validator.description_length')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    generalValidator
];

const find = [
    param('id')
        .notEmpty()
            .withMessage('project.validator.id_require')
        .isMongoId()
            .withMessage('project.validator.id_invalid')
        .trim(),
    generalValidator
];

const remove = [
    param('id')
        .notEmpty()
            .withMessage('project.validator.id_require')
        .isMongoId()
            .withMessage('project.validator.id_invalid')
        .trim(),
    generalValidator
];

export { create, find, update, remove }