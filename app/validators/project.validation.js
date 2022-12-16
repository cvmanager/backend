import { body, param } from 'express-validator';

import generalValidator from '../helper/validator.js';

class ProjectValidation {
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
                .isLength({ min: 1, max: 50 }).withMessage('project.validations.project_name_length').trim(),
            body('company_id')
                .optional({ nullable: true, checkFalsy: true })
                .isMongoId().withMessage('company.validations.company_id_invalid').trim(),
            body('description')
                .optional({ nullable: true, checkFalsy: true })
                .isLength({ min: 10, max: 100 }).withMessage('project.validations.project_description_length').trim(),
            generalValidator
        ];
    }

    find() {
        return [
            param('id')
                .notEmpty().isMongoId().withMessage('project.validations.project_id_invalid').trim(),
            generalValidator
        ];
    }

    remove() {
        return [
            param('id')
                .notEmpty().isMongoId()
                .withMessage('project.validations.project_id_invalid').trim(),
            generalValidator
        ];
    }

    manager() {
        return [
            param('id')
                .notEmpty().isMongoId()
                .withMessage('project.validations.project_id_invalid')
                .trim(),
            body('manager_id')
                .notEmpty().isMongoId()
                .withMessage('company.validations.manager_id_invalid').trim(),
            generalValidator
        ]
    }
}

export default new ProjectValidation();
