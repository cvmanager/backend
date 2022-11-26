import { body, param } from 'express-validator'

import generalValidator from '../helper/validator.js';


class CompanyValidation {
    create() {
        return [
            body('name')
                .notEmpty()
                .withMessage('company.validation.company_name_required')
                .isLength({ min: 3, max: 50 })
                .withMessage('company.validation.company_name_length')
                .trim(),
            generalValidator
        ];
    }
    
    find() {
        return [
            param('id')
                .notEmpty()
                .withMessage('company.validation.company_id_required')
                .isMongoId()
                .withMessage('company.validation.company_id_invalid')
                .trim(),
            generalValidator
        ]
    }

    update() {
        return [
            param('id')
                .notEmpty()
                .withMessage('company.validation.company_id_required')
                .isMongoId()
                .withMessage('company.validation.company_id_invalid')
                .trim(),
            body('name')
                .isLength({ min: 1, max: 50 })
                .withMessage('company.validation.company_name_length')
                .optional({ nullable: true, checkFalsy: true })
                .trim(),
            generalValidator
        ];
    }

    remove() {
        return [
            param('id')
                .notEmpty()
                .withMessage('company.validation.company_id_required')
                .isMongoId()
                .withMessage('company.validation.company_id_invalid')
                .trim(),
            generalValidator
        ];
    }

    manager() {
        return [
            param('id')
                .notEmpty()
                .withMessage('company.validation.id_required')
                .isMongoId()
                .withMessage('company.validation.id_invalid')
                .trim(),
            body('manager_id')
                .notEmpty()
                .withMessage('company.validation.company_id_required')
                .isMongoId()
                .withMessage('company.validation.company_id_invalid')
                .trim(),
            generalValidator
        ]
    }
}

export default new CompanyValidation();