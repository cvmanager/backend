import { body, oneOf } from 'express-validator';

import generalValidator from '../helper/validator.js';
import { mobileFormat } from '../helper/helper.js';


class AuthValidator {
    signup() {
        return [
            body('firstname')
                .notEmpty()
                .isLength({ min: 3, max: 80 })
                .withMessage('auth.validations.first_name_length')
                .trim(),
            body('lastname')
                .notEmpty()
                .isLength({ min: 3, max: 80 })
                .withMessage('auth.validations.last_name_length')
                .trim(),
            body('mobile')
                .notEmpty()
                .withMessage('auth.validations.mobile_required')
                .matches(mobileFormat)
                .withMessage('auth.validations.mobile_pattern')
                .trim(),
            body('username')
                .notEmpty()
                .isLength({ min: 3, max: 30 })
                .withMessage('auth.validations.username_length')
                .trim(),
            body('password')
                .notEmpty()
                .isLength({ min: 8 })
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
                    .isLength({ min: 3, max: 15 })
                    .trim()
                    .withMessage('auth.validations.username_wrong')
            ]),
            body('password')
                .notEmpty()
                .withMessage('auth.validations.password_required')
                .isLength({ min: 8 })
                .withMessage('auth.validations.password_length')
                .trim(),
            generalValidator
        ]
    }

    checkUsername() {
        return [
            body('username')
                .notEmpty()
                .withMessage('auth.validations.username_required')
                .trim(),
            generalValidator
        ]
    }
    checkVerifyMobileCode() {
        return [
            body('verify_code')
                .notEmpty()
                .withMessage('auth.validations.verifycode_required')
                .trim(),
            generalValidator
        ]
    }

}

export default new AuthValidator();