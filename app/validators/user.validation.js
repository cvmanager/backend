import { param, body } from 'express-validator';

import generalValidator from '../helper/validator.js';

const find = [
    param('id')
        .notEmpty()
        .withMessage('user.validator.id_require')
        .isMongoId()
        .withMessage('user.validator.id_invalid')
        .trim(),
    generalValidator
];

const updateProfileImage = [
    body('avatar')
        .notEmpty()
        .withMessage('user.validator.avatar_require')
        .trim(),
    generalValidator
]

const ban = [
    param('id')
        .notEmpty()
        .withMessage('user.validator.id_require')
        .isMongoId()
        .withMessage('user.validator.id_invalid')
        .trim(),
    generalValidator
]


export { find, updateProfileImage, ban }