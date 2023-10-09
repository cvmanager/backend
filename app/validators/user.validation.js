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

    role() {
        return [
            param('id')
                .notEmpty().isMongoId().withMessage('user.validations.user_id_invalid').trim(),
            body('role_id')
                .notEmpty().isMongoId().withMessage('user.validations.role_id_invalid').trim(),
            generalValidator
        ];
    }
}


export default new UserValidation()