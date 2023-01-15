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

}


export default new UserValidation()