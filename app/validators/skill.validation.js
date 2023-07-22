import { body, param, query } from 'express-validator';

import generalValidator from '../helper/validator.js';
import i18n from '../middlewares/lang.middleware.js';
import { mobileFormat } from '../helper/helper.js';
import { json } from 'express';
class SkillValidation {

    index() {
        return [
            query('page')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('skill.validations.skill_page_number').trim(),
            query('size')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('skill.validations.skill_size_number').trim(),
            generalValidator
        ];
    }

    create() {
        return [
            body('title')
                .notEmpty()
                .withMessage('skill.validations.title_required')
                .isLength({ min: 1, max: 100 })
                .withMessage('skill.validations.title_length')
                .trim(),
            body('icon')
                .optional({ nullable: true, checkFalsy: true })
                .trim(),
            generalValidator
        ];
    }


}

export default new SkillValidation();