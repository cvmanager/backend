import { body, param, query } from 'express-validator';

import generalValidator from '../helper/validator.js';

const index = [
    query('page')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric().withMessage('permission.validations.permission_page_number').trim(),
    query('size')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric().withMessage('permission.validations.permission_size_number').trim(),
    generalValidator
];

const create = [
    body('name')
        .notEmpty()
            .withMessage('permission.validation.permission_name_require')
        .isLength({ min: 3 })
            .withMessage('permission.validation.permission_name_length')
        .trim(),
    body('description')
        .isLength({ min: 5, max: 100 })
            .withMessage('permission.validation.permission_description_length')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    generalValidator
]; 

const update = [
    body('name')
        .isLength({ min: 3, max: 50 })
            .withMessage('permission.validation.permission_name_length')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    body('description')
        .isLength({ min: 10 })
            .withMessage('permission.validation.permission_description_length')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    generalValidator
];

const find = [
    param('id')
        .notEmpty()
            .withMessage('permission.validation.permission_id_required')
        .isMongoId()
            .withMessage('permission.validation.permission_id_invalid')
        .trim(),
    generalValidator
];

const remove = [
    param('id')
        .notEmpty()
            .withMessage('permission.validation.permission_id_required')
        .isMongoId()
            .withMessage('permission.validation.permission_id_invalid')
        .trim(),
    generalValidator
];

export { index, create, find, update, remove }