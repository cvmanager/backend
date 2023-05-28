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
}

export default new ProfileValidator();