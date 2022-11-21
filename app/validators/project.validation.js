import { body, param } from 'express-validator';

import generalValidator from '../helper/validator.js';

class ProjectValidation {
    create() {
        return [
            body('company_id')
                .notEmpty()
                .withMessage('company.validation.company_id_require')
                .isMongoId()
                .withMessage('company.validation.company_id_invalid')
                .trim(),
            body('manager_id')
                .notEmpty()
                .withMessage('company.validation.manager_id_require')
                .isMongoId()
                .withMessage('company.validation.manager_id_invalid')
                .trim(),
            body('name')
                .notEmpty()
                .withMessage('project.validation.project_name_require')
                .isLength({ min: 3, max: 50 })
                .withMessage('project.validation.project_name_length')
                .trim(),
            body('description')
                .notEmpty()
                .withMessage('project.validation.project_description_require')
                .isLength({ min: 10, max: 100 })
                .withMessage('project.validation.project_name_length')
                .trim(),
            generalValidator
        ];
    }

    update() {
        return [
            body('name')
                .isLength({ min: 1, max: 50 })
                .withMessage('project.validation.project_name_length')
                .optional({ nullable: true, checkFalsy: true })
                .trim(),
            body('description')
                .isLength({ min: 10 })
                .withMessage('project.validation.project_description_length')
                .optional({ nullable: true, checkFalsy: true })
                .trim(),
            generalValidator
        ];
    }

    find() {
        return [
            param('id')
                .notEmpty()
                .withMessage('project.validation.project_id_required')
                .isMongoId()
                .withMessage('project.validation.project_id_invalid')
                .trim(),
            generalValidator
        ];
    }

    remove() {
        return [
            param('id')
                .notEmpty()
                .withMessage('project.validation.project_id_required')
                .isMongoId()
                .withMessage('project.validation.project_id_invalid')
                .trim(),
            generalValidator
        ];
    }

    manager() {
        return [
            param('id')
                .notEmpty()
                .withMessage('resume.validation.id_required')
                .isMongoId()
                .withMessage('resume.validation.id_invalid')
                .trim(),
            body('manager_id')
                .notEmpty()
                .withMessage('resume.validation.manager_id_required')
                .isMongoId()
                .withMessage('project.validation.project_id_invalid')
                .trim(),
            generalValidator
        ]
    }
}

export default new ProjectValidation();
