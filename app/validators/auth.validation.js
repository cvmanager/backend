import { body } from 'express-validator';

import generalValidator from '../helper/validator.js';
import { mobileFormat } from '../helper/helper.js';

const signup = [
    body('firstname')
        .notEmpty()
            .withMessage('auth.validation.firstname_required')
        .isLength({ min: 3, max: 80 })
            .withMessage('auth.validation.firstname_length')
        .trim(),
    body('lastname')
        .notEmpty()
            .withMessage('auth.validation.lastname_required')
        .isLength({ min: 3, max: 80 })
            .withMessage('auth.validation.lastname_length')
        .trim(),
    body('mobile')
        .notEmpty()
            .withMessage('auth.validation.mobile_required')
        .matches(mobileFormat)
            .withMessage('auth.validation.mobile_pattern')
        .trim(),
    body('password')
        .notEmpty()
            .withMessage('auth.validation.password_required')
        .isLength({ min: 8, max: 10 })
            .withMessage('auth.validation.password_length')
        .trim(),
    body('password_confirm')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('auth.validation.pass_confirm_match')
            }
            return true;
        })
        .trim(),
    generalValidator
];


const login = [
    body('mobile')
        .notEmpty()
            .withMessage('auth.validation.mobile_required')
        .matches(mobileFormat)
            .withMessage('auth.validation.mobile_pattern')
        .trim(),
    body('password')
        .notEmpty()
            .withMessage('auth.validation.password_required')
        .isLength({ min: 8, max: 10 })
            .withMessage('auth.validation.password_length')
        .trim(),
    generalValidator
];

export { signup, login }