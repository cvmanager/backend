import { body, param } from 'express-validator'
import generalValidator from '../helper/validator.js';
import i18n from '../middlewares/lang.middleware.js'

class PositionValidation {
    create() {
        return [
            body('project_id').notEmpty().isMongoId().withMessage('position.validations.project_id_invalid').trim(),
            body('title').notEmpty().isLength({ min: 3, max: 50 }).withMessage('position.validations.position_title_length').trim(),
            body('level')
                .optional({ nullable: true, checkFalsy: true })
                .notEmpty().isIn(i18n.__("position.enums.level"))
                .withMessage('position.validations.position_level_incorrect').trim(),
            generalValidator
        ];
    }

    find() {
        return [
            param('id').notEmpty().isMongoId().withMessage('position.validations.position_id_invalid').trim(),
            generalValidator
        ]
    }

    update() {
        return [
            param('id').notEmpty().isMongoId().withMessage('position.validations.position_id_invalid').trim(),
            body('title')
                .optional({ nullable: true, checkFalsy: true }).isLength({ min: 3, max: 50 })
                .withMessage('position.validations.position_title_length').trim(),
            body('level')
                .optional({ nullable: true, checkFalsy: true }).isIn(i18n.__("position.enums.level"))
                .withMessage('position.validations.position_level_incorrect')
                .trim(),
            generalValidator
        ];
    }

    manager() {
        return [
            param('id').isMongoId().withMessage('position.validations.position_id_invalid').trim(),
            body('manager_id')
                .notEmpty().isMongoId()
                .withMessage('position.validations.manager_id_invalid').trim(),
            generalValidator
        ];
    }

    remove() {
        return [
            param('id').notEmpty().isMongoId().withMessage('position.validations.position_id_invalid').trim(),
            generalValidator
        ];
    }
}

export default new PositionValidation();