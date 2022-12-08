import { body } from 'express-validator';

import generalValidator from '../helper/validator.js';
import { mobileFormat } from '../helper/helper.js';


class AuthValidator {
    signup() {
        return [
            body('firstname')
                .notEmpty()
                .withMessage('auth.validations.firstname_required')
                .isLength({ min: 3, max: 80 })
                .withMessage('auth.validations.firstname_length')
                .trim(),
            body('lastname')
                .notEmpty()
                .withMessage('auth.validations.lastname_required')
                .isLength({ min: 3, max: 80 })
                .withMessage('auth.validations.lastname_length')
                .trim(),
            body('mobile')
                .notEmpty()
                .withMessage('auth.validations.mobile_required')
                .matches(mobileFormat)
                .withMessage('auth.validations.mobile_pattern')
                .trim(),
            body('password')
                .notEmpty()
                .withMessage('auth.validations.password_required')
                .isLength({ min: 8, max: 10 })
                .withMessage('auth.validations.password_length')
                .trim(),
            body('password_confirm')
                .custom((value, { req }) => {
                    if (value !== req.body.password) {
                        throw new Error('auth.validations.pass_confirm_match')
                    }
                    return true;
                })
                .trim(),
            generalValidator
        ]
    }

    login() {
        return [
            body('mobile')
                .notEmpty()
                .withMessage('auth.validations.mobile_required')
                .matches(mobileFormat)
                .withMessage('auth.validations.mobile_pattern')
                .trim(),
            body('password')
                .notEmpty()
                .withMessage('auth.validations.password_required')
                .isLength({ min: 8, max: 10 })
                .withMessage('auth.validations.password_length')
                .trim(),
            generalValidator
        ]
    }
}

export default new AuthValidator();