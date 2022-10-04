import { body } from 'express-validator';

import generalValidator from '../helper/validator.js';
import { mobileFormat } from '../helper/helper.js';

const signup = [
    body('firstname')
        .notEmpty()
            .withMessage('auth.validator.firstname_require')
        .isLength({ min: 3, max: 80 })
            .withMessage('auth.validator.firstname_length')
        .trim(),
    body('lastname')
        .notEmpty()
            .withMessage('auth.validator.lastname_require')
        .isLength({ min: 3, max: 80 })
            .withMessage('auth.validator.lastname_length')
        .trim(),
    body('mobile')
        .notEmpty()
            .withMessage('auth.validator.mobile_require')
        .matches(mobileFormat)
            .withMessage('auth.validator.mobile_pattern')
        .trim(),
    body('password')
        .notEmpty()
            .withMessage('auth.validator.pass_require')
        .isLength({ min: 8, max: 10 })
            .withMessage('auth.validator.pass_length')
        .trim(),
    body('password_confirm')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('auth.validator.pass_confirm_match')
            }
            return true;
        })
        .trim(),
    generalValidator
];


const login = [
    body('mobile')
        .notEmpty()
            .withMessage('auth.validator.mobile_require')
        .matches(mobileFormat)
            .withMessage('auth.validator.mobile_pattern')
        .trim(),
    body('password')
        .notEmpty()
            .withMessage('auth.validator.pass_require')
        .isLength({ min: 8, max: 10 })
            .withMessage('auth.validator.pass_length')
        .trim(),
    generalValidator
];

export { signup, login }