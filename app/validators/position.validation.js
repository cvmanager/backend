import { body, param } from 'express-validator'
import generalValidator from '../helper/validator.js';
import i18n from '../middlewares/lang.middleware.js'

class PositionValidation {
    create() {generalValidator
        return [
            body('project_id')
                .notEmpty()
                .withMessage('position.validation.project_id_required')
                .isMongoId()
                .withMessage('position.validation.project_id_invalid')
                .trim(),
            body('company_id')
                .notEmpty()
                .withMessage('position.validation.company_id_required')
                .isMongoId()
                .withMessage('position.validation.company_id_invalid')
                .trim(),
            body('title')
                .notEmpty()
                .withMessage('position.validation.position_title_required')
                .isLength({ min: 3, max: 50 })
                .withMessage('position.validation.position_title_length')
                .trim(),
            body('level')
                .notEmpty()
                .withMessage('position.validation.position_level_required')
                .isIn(i18n.__("enums.positions"))
                .withMessage('position.validation.position_level_incorrect')
                .trim(),
            body('is_active')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric()
                .withMessage('position.validation.position_is_active_incorrect')
                .trim(),
            generalValidator
        ];
    }
}

export default new PositionValidation();