import { body } from 'express-validator';

import generalValidator from '../helper/validator.js';
import { mobileFormat } from '../helper/helper.js';

const signup = [
    body('firstname')
        .notEmpty().withMessage('firstname is require')
        .isLength({ min: 3, max: 80 }).withMessage('first name should not be empty, should be more than one and less than 3 character')
        .trim(),
    body('lastname')
        .notEmpty().withMessage('lastname is require')
        .isLength({ min: 3, max: 80 }).withMessage('last name should not be empty, should be more than one and less than 3 character')
        .trim(),
    body('mobile')
        .notEmpty().withMessage('mobile is require')
        .matches(mobileFormat).withMessage('Mobile number invalid(must start with 98)')
        .trim(),
    body('password')
        .notEmpty().withMessage('password is require')
        .isLength({ min: 8, max: 10 }).withMessage('password should not be empty, should be more than one and between 8 - 10  character')
        .trim(),
    body('password_confirm')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match with password')
            }
            return true;
        })
        .trim(),
    generalValidator
];


const login = [
    body('mobile')
        .notEmpty().withMessage('mobile is require')
        .matches(mobileFormat).withMessage('Mobile number invalid(must start with 98)')
        .trim(),
    body('password')
        .notEmpty().withMessage('password is require')
        .isLength({ min: 8, max: 10 }).withMessage('password should not be empty, should be more than one and between 8 - 10  character')
        .trim(),
    generalValidator
];

export { signup, login }