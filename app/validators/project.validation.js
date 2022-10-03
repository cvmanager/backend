import { body, param } from 'express-validator';

import generalValidator from '../helper/validator.js';

const create = [
    body('company_id')
        .notEmpty().withMessage('company is require')
        .isMongoId().withMessage('company is not valid!')
        .trim(),
    body('name')
        .notEmpty().withMessage('name is require')
        .isLength({ min: 3, max: 50 }).withMessage('project name should not be empty, should be more than one and less than 3 character')
        .trim(),
    body('description')
        .notEmpty().withMessage('description is require')
        .isLength({ min: 10, max: 100 }).withMessage('project description should not be empty, should be more than one and less than 3 character')
        .trim(),
    generalValidator
];

const update = [
    body('name')
        .isLength({ min: 1, max: 50 }).withMessage('name should not be empty, should be more than one and less than 50 character')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    body('description')
        .isLength({ min: 10 }).withMessage('des min 10 char')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    generalValidator
];

const find = [
    param('id')
        .notEmpty().withMessage('project id is required')
        .isMongoId().withMessage('project id invalid')
        .trim(),
    generalValidator
];

const remove = [
    param('id')
        .notEmpty().withMessage('project id is required')
        .isMongoId().withMessage('project id invalid')
        .trim(),
    generalValidator
];

export { create, find, update, remove }