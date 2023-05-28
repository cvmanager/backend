import { body } from 'express-validator';

import generalValidator from '../helper/validator.js';


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
}

export default new ProfileValidator();