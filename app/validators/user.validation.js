import { param, body } from 'express-validator';

import generalValidator from '../helper/validator.js';

const find = [
    param('id')
        .notEmpty().withMessage('user id is required')
        .isMongoId().withMessage('user id invalid')
        .trim(),
    generalValidator
];

const updateProfileImage = [
    body('avatar')
        .notEmpty().withMessage('avatar is required')
        .trim(),
    generalValidator
]


export { find,updateProfileImage }