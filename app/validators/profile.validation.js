import { body, param, query } from 'express-validator'
import i18n from '../middlewares/lang.middleware.js';

import generalValidator from '../helper/validator.js';
import { getEnume } from '../helper/helper.js';


class ProfileValidator {
    changePassword() {
        return [
            body('old_password').isLength({ min: 8, max: 10 }).withMessage('user.errors.old_password_length_not_confirm').trim(),
            body('password').isLength({ min: 8, max: 10 }).withMessage('user.errors.password_length_not_confirm').trim(),
            generalValidator
        ]
    }



    edit() {
        return [
            body('firstname').isLength({ min: 3, max: 80 }).withMessage('auth.validations.firstname_length').trim(),
            body('lastname').isLength({ min: 3, max: 80 }).withMessage('auth.validations.lastname_length').trim(),
            body('username').notEmpty().withMessage('auth.validations.username_required').trim(),
            body('email').notEmpty().isEmail().withMessage('auth.validations.email_invalid').trim(),
            generalValidator
        ]
    }

    notifications() {
        return [
            query('page')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('notification.validations.notification_page_number').trim(),
            query('size')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('notification.validations.notification_size_number').trim(),
            query('state')
                .optional({ nullable: true, checkFalsy: true })
                .isIn(getEnume("notification","list_state")).withMessage('notification.validations.notification_unvalid_state_send').trim(),
            generalValidator
        ];
    }
}

export default new ProfileValidator();