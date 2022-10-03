import { body, param } from 'express-validator'

import generalValidator from '../helper/validator.js';

const create = [
    body('name')
        .notEmpty().withMessage('name is require')
        .isLength({ min: 3, max: 50 }).withMessage('company name should not be empty, should be more than one and less than 3 character')
        .trim(),
    generalValidator
];

const find = [
    param('id')
        .notEmpty().withMessage('company id  is require')
        .isMongoId().withMessage('company id invalid!')
        .trim(),
    generalValidator
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
    generalValidator
];

const remove = [
    param('id')
        .notEmpty().withMessage('company id is required')
        .isMongoId().withMessage('company id invalid')
        .trim(),
    generalValidator
];

export { create, find, update, remove }