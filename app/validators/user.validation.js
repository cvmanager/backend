import { param, body, query } from 'express-validator';

import generalValidator from '../helper/validator.js';
class UserValidation {
    index() {
        return [
            query('page')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('company.validations.company_page_number').trim(),
            query('size')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('company.validations.company_size_number').trim(),
            generalValidator
        ];
    }
    find() {
        return [
            param('id')
                .notEmpty()
                .withMessage('user.validations.user_id_required')
                .isMongoId()
                .withMessage('user.validations.user_id_invalid')
                .trim(),
            generalValidator
        ];
    }

    updateProfileImage() {
        return [
            body('avatar')
                .notEmpty()
                .withMessage('user.validations.avatar_required')
                .trim(),
            generalValidator
        ];
    }

    ban() {
        return [
            param('id')
                .notEmpty()
                .withMessage('user.validations.user_id_required')
                .isMongoId()
                .withMessage('user.validations.user_id_invalid')
                .trim(),
            generalValidator
        ];
    }

    changePassword() {
        return [
            body('old_password')
                .notEmpty()
                .withMessage('user.errors.old_password_cant_be_empty')
                .isLength({ min: 8, max: 10 })
                .withMessage('user.errors.old_password_length_not_confirm')
                .trim(),
            body('password')
                .notEmpty()
                .withMessage('user.errors.password_cant_be_empty')
                .isLength({ min: 8, max: 10 })
                .withMessage('user.errors.password_length_not_confirm')
                .trim(),
            generalValidator
        ]
    }

    loginHistory() {
        return [
            param('id')
                .notEmpty()
                .withMessage('user.validations.user_id_required')
                .isMongoId()
                .withMessage('user.validations.user_id_invalid')
                .trim(),
            query('page')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('user.validations.user_page_number').trim(),
            query('size')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('user.validations.user_size_number').trim(),
            generalValidator
        ];
    }

    edit() {
        return [
            param('id')
                .notEmpty()
                .withMessage('user.validations.user_id_required')
                .isMongoId()
                .withMessage('user.validations.user_id_invalid')
                .trim(),
            body('firstname')
                .isLength({ min: 3, max: 80 })
                .withMessage('auth.validations.firstname_length')
                .trim(),
            body('lastname')
                .isLength({ min: 3, max: 80 })
                .withMessage('auth.validations.lastname_length')
                .trim(),
            body('username')
                .notEmpty()
                .withMessage('auth.validations.username_required')
                .trim(),
            body('email')
                .notEmpty()
                .withMessage('auth.validations.email_required')
                .isEmail()
                .withMessage('auth.validations.email_invalid')
                .trim(),
            generalValidator
        ]
    }
    
}


export default new UserValidation()