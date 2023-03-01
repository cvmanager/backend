import { body, param, query } from 'express-validator';

import generalValidator from '../helper/validator.js';

const index = [
    query('page')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric().withMessage('role.validations.role_page_number').trim(),
    query('size')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric().withMessage('role.validations.role_size_number').trim(),
    generalValidator
];

const create = [
    body('name')
        .notEmpty()
            .withMessage('role.validation.role_name_require')
        .isLength({ min: 3, max: 50 })
            .withMessage('role.validation.role_name_length')
        .trim(),
    body('description')
        .isLength({ min: 5, max: 100 })
            .withMessage('role.validation.role_description_length')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    body('parent')
        .isMongoId()
            .withMessage('role.validation.parent_id_invalid')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    generalValidator
]; 

const update = [
    body('name')
        .isLength({ min: 3, max: 50 })
            .withMessage('role.validation.role_name_length')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    body('description')
        .isLength({ min: 10 })
            .withMessage('role.validation.role_description_length')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    body('parent')
        .isMongoId()
            .withMessage('role.validation.parent_id_invalid')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    generalValidator
];

const find = [
    param('id')
        .notEmpty()
            .withMessage('role.validation.role_id_required')
        .isMongoId()
            .withMessage('role.validation.role_id_invalid')
        .trim(),
    generalValidator
];

const remove = [
    param('id')
        .notEmpty()
            .withMessage('role.validation.role_id_required')
        .isMongoId()
            .withMessage('role.validation.role_id_invalid')
        .trim(),
    generalValidator
];

export { index, create, find, update, remove }