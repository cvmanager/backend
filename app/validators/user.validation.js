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
            param('id').notEmpty().isMongoId().withMessage('user.validations.user_id_invalid').trim(),
            generalValidator
        ];
    }

    updateProfileImage() {
        return [
            param('id').notEmpty().isMongoId().withMessage('user.validations.user_id_invalid').trim(),
            generalValidator
        ];
    }

    ban() {
        return [
            param('id').notEmpty().isMongoId().withMessage('user.validations.user_id_invalid_ban').trim(),
            generalValidator
        ];
    }

    unban() {
        return [
            param('id').notEmpty().isMongoId().withMessage('user.validations.user_id_invalid').trim(),
            generalValidator
        ];
    }


    loginHistory() {
        return [
            param('id').notEmpty().isMongoId().withMessage('user.validations.user_id_invalid').trim(),
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
            param('id').notEmpty().isMongoId().withMessage('user.validations.user_id_invalid').trim(),
            body('firstname').isLength({ min: 3, max: 80 }).withMessage('auth.validations.firstname_length').trim(),
            body('lastname').isLength({ min: 3, max: 80 }).withMessage('auth.validations.lastname_length').trim(),
            body('username').notEmpty().withMessage('auth.validations.username_required').trim(),
            body('email').notEmpty().isEmail().withMessage('auth.validations.email_invalid').trim(),
            generalValidator
        ]
    }

    companies() {
        return [
            param('id').notEmpty().isMongoId().withMessage('user.validations.user_id_invalid').trim(),
            query('page')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('user.validations.user_page_number').trim(),
            query('size')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('user.validations.user_size_number').trim(),
            generalValidator
        ];
    }

    check_fcm_token() {
        return [
            param('id')
                .notEmpty()
                .withMessage('user.validations.user_id_required')
                .isMongoId()
                .withMessage('user.validations.user_id_invalid')
                .trim(),
            body('token')
                .notEmpty()
                .withMessage('user.validations.fcm_token_required')
                .isLength({ min: 5, max: 1000 })
                .withMessage('user.validations.fcm_token_length')
                .trim(),
            generalValidator
        ];
    }

    set_fcm_token() {
        return [
            param('id')
                .notEmpty()
                .withMessage('user.validations.user_id_required')
                .isMongoId()
                .withMessage('user.validations.user_id_invalid')
                .trim(),
            body('token')
                .notEmpty()
                .withMessage('user.validations.fcm_token_required')
                .isLength({ min: 5, max: 1000 })
                .withMessage('user.validations.fcm_token_length')
                .trim(),
            generalValidator
        ];
    }

    unset_fcm_token() {
        return [
            param('id')
                .notEmpty()
                .withMessage('user.validations.user_id_required')
                .isMongoId()
                .withMessage('user.validations.user_id_invalid')
                .trim(),
            body('token')
                .notEmpty()
                .withMessage('user.validations.fcm_token_required')
                .isLength({ min: 5, max: 1000 })
                .withMessage('user.validations.fcm_token_length')
                .trim(),
            generalValidator
        ];
    }

}


export default new UserValidation()