import { param, body } from 'express-validator';

import generalValidator from '../helper/validator.js';
class UserValidation {
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

}


export default new UserValidation()