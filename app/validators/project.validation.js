import { body, param, query } from 'express-validator';

import generalValidator from '../helper/validator.js';

class ProjectValidation {
    index() {
        return [
            query('page')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('project.validations.project_page_number').trim(),
            query('size')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('project.validations.project_size_number').trim(),
            generalValidator
        ];
    }

    create() {
        return [
            body('company_id')
                .notEmpty().isMongoId().withMessage('company.validations.company_id_invalid').trim(),
            body('name')
                .notEmpty().isLength({ min: 3, max: 50 }).withMessage('project.validations.project_name_length').trim(),
            body('description')
                .optional({ nullable: true, checkFalsy: true })
                .isLength({ min: 10, max: 100 }).withMessage('project.validations.project_description_length').trim(),
            generalValidator
        ];
    }

    update() {
        return [
            param('id')
                .notEmpty().isMongoId().withMessage('project.validations.project_id_invalid').trim(),
            body('name')
                .optional({ nullable: true, checkFalsy: true })
                .isLength({ min: 3, max: 50 }).withMessage('project.validations.project_name_length').trim(),
            body('description')
                .optional({ nullable: true, checkFalsy: true })
                .isLength({ min: 10, max: 100 }).withMessage('project.validations.project_description_length').trim(),
            generalValidator
        ];
    }

    find() {
        return [
            param('id').notEmpty().isMongoId().withMessage('project.validations.project_id_invalid').trim(),
            generalValidator
        ];
    }

    remove() {
        return [
            param('id').notEmpty().isMongoId().withMessage('project.validations.project_id_invalid').trim(),
            generalValidator
        ];
    }

    manager() {
        return [
            param('id').notEmpty().isMongoId().withMessage('project.validations.project_id_invalid').trim(),
            body('manager_id').notEmpty().isMongoId().withMessage('company.validations.manager_id_invalid').trim(),
            generalValidator
        ]
    }

    deleteManager() {
        return [
            param('id').notEmpty().isMongoId().withMessage('project.validations.project_id_invalid').trim(),
            body('manager_id').notEmpty().isMongoId().withMessage('company.validations.manager_id_invalid').trim(),
            generalValidator
        ]
    }

    active() {
        return [
            param('id').notEmpty().isMongoId().withMessage('project.validations.project_id_invalid').trim(),
            generalValidator
        ];
    }

    deActive() {
        return [
            param('id').notEmpty().isMongoId().withMessage('project.validations.project_id_invalid').trim(),
            generalValidator
        ];
    }

    logo() {
        return [
            param('id').notEmpty().isMongoId().withMessage('project.validations.project_id_invalid').trim(),
            generalValidator
        ];
    }


}

export default new ProjectValidation();
