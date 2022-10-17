import { body, param } from 'express-validator';

import generalValidator from '../helper/validator.js';

const create = [
    body('company_id')
        .notEmpty()
            .withMessage('company.validation.company_id_require')
        .isMongoId()
            .withMessage('company.validation.company_id_invalid')
        .trim(),
    body('name')
        .notEmpty()
            .withMessage('project.validation.project_name_require')
        .isLength({ min: 3, max: 50 })
            .withMessage('project.validation.project_name_length')
        .trim(),
    body('description')
        .notEmpty()
            .withMessage('project.validation.project_description_require')
        .isLength({ min: 10, max: 100 })
            .withMessage('project.validation.project_name_length')
        .trim(),
    generalValidator
];

const update = [
    body('name')
        .isLength({ min: 1, max: 50 })
            .withMessage('project.validation.project_name_length')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    body('description')
        .isLength({ min: 10 })
            .withMessage('project.validation.project_description_length')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    generalValidator
];

const find = [
    param('id')
        .notEmpty()
            .withMessage('project.validation.project_id_required')
        .isMongoId()
            .withMessage('project.validation.project_id_invalid')
        .trim(),
    generalValidator
];

const remove = [
    param('id')
        .notEmpty()
            .withMessage('project.validation.project_id_required')
        .isMongoId()
            .withMessage('project.validation.project_id_invalid')
        .trim(),
    generalValidator
];

export { create, find, update, remove }