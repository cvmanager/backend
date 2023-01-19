import { body, param, query } from 'express-validator'
import generalValidator from '../helper/validator.js';
import i18n from '../middlewares/lang.middleware.js'

class PositionValidation {
    index() {
        return [
            query('page')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('position.validations.position_page_number').trim(),
            query('size')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('position.validations.position_size_number').trim(),
            generalValidator
        ];
    }

    create() {
        return [
            body('project_id').notEmpty().isMongoId().withMessage('position.validations.project_id_invalid').trim(),
            body('title').notEmpty().isLength({ min: 3, max: 50 }).withMessage('position.validations.position_title_length').trim(),
            body('level')
                .optional({ nullable: true, checkFalsy: true })
                .notEmpty().isIn(i18n.__("position.enums.level"))
                .withMessage('position.validations.position_level_incorrect').trim(),
            body('description')
                .optional({ nullable: true, checkFalsy: true })
                .isLength({ min: 10, max: 100 }).withMessage('position.validations.position_description_length').trim(),
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
            param('id')
                .notEmpty()
                .withMessage('position.validations.position_id_required')
                .isMongoId()
                .withMessage('position.validations.position_id_invalid')
                .trim(),
            body('project_id')
                .optional({ nullable: true, checkFalsy: true })
                .isMongoId()
                .withMessage('position.validations.project_id_invalid')
                .trim(),
            body('title')
                .optional({ nullable: true, checkFalsy: true }).isLength({ min: 3, max: 50 })
                .withMessage('position.validations.position_title_length').trim(),
            body('level')
                .optional({ nullable: true, checkFalsy: true }).isIn(i18n.__("position.enums.level"))
                .withMessage('position.validations.position_level_incorrect')
                .trim(),
            body('description')
                .optional({ nullable: true, checkFalsy: true })
                .isLength({ min: 10, max: 100 }).withMessage('position.validations.position_description_length').trim(),
            body('is_active')
                .optional({ nullable: true, checkFalsy: true })
                .isBoolean()
                .withMessage('position.validations.position_is_active_invalid')
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