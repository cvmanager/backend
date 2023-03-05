import { body, oneOf } from 'express-validator';

import generalValidator from '../helper/validator.js';
import { mobileFormat } from '../helper/helper.js';


class AuthValidator {
    signup() {
        return [
            body('firstname')
                .notEmpty()
                .isLength({ min: 3, max: 80 })
                .withMessage('auth.validations.firstname_length')
                .trim(),
            body('lastname')
                .notEmpty()
                .isLength({ min: 3, max: 80 })
                .withMessage('auth.validations.lastname_length')
                .trim(),
            body('mobile')
                .notEmpty()
                .withMessage('auth.validations.mobile_required')
                .matches(mobileFormat)
                .withMessage('auth.validations.mobile_pattern')
                .trim(),
            body('username')
                .notEmpty()
                .isLength({ min: 5, max: 10 })
                .withMessage('auth.validations.username_lenght')
                .trim(),
            body('password')
                .notEmpty()
                .isLength({ min: 8, max: 10 })
                .withMessage('auth.validations.password_length')
                .trim(),
            generalValidator
        ]
    }

    login() {
        return [
            oneOf([
                body('mobile')
                    .notEmpty()
                    .matches(mobileFormat)
                    .trim()
                    .withMessage('auth.validations.mobile_wrong'),
                body('mobile')
                    .notEmpty()
                    .isLength({ min: 5, max: 10 })
                    .trim()
                    .withMessage('auth.validations.username_wrong')
            ]),
            body('password')
                .notEmpty()
                .withMessage('auth.validations.password_required')
                .isLength({ min: 8, max: 10 })
                .withMessage('auth.validations.password_length')
                .trim(),
            generalValidator
        ]
    }

    checkusername() {
        return [
            body('username')
                .notEmpty()
                .withMessage('auth.validations.username_required')
                .trim(),
            generalValidator
        ]
    }
}

export default new AuthValidator();