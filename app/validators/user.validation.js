import { param, body } from 'express-validator';

import generalValidator from '../helper/validator.js';

const find = [
    param('id')
        .notEmpty()
        .withMessage('user.validator.user_id_required')
        .isMongoId()
        .withMessage('user.validator.user_id_invalid')
        .trim(),
    generalValidator
];

const updateProfileImage = [
    body('avatar')
        .notEmpty()
        .withMessage('user.validator.avatar_required')
        .trim(),
    generalValidator
]

const ban = [
    param('id')
        .notEmpty()
        .withMessage('user.validator.user_id_required')
        .isMongoId()
        .withMessage('user.validator.user_id_invalid')
        .trim(),
    generalValidator
]


export { find, updateProfileImage, ban }