import { body, param, query } from 'express-validator'

import generalValidator from '../helper/validator.js';


class CompanyValidation {

    index() {
        return [
            query('page')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('company.validations.company_page_number').trim(),
            query('size')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('company.validations.company_size_number').trim(),
            generalValidator
        ];
    }

    create() {
        return [
            body('name')
                .notEmpty().isLength({ min: 3, max: 50 }).withMessage('company.validations.company_name_length').trim(),
            generalValidator
        ];
    }

    find() {
        return [
            param('id')
                .notEmpty().isMongoId().withMessage('company.validations.company_id_invalid').trim(),
            generalValidator
        ]
    }

    update() {
        return [
            param('id')
                .notEmpty().isMongoId().withMessage('company.validations.company_id_invalid').trim(),
            body('name')
                .optional({ nullable: true, checkFalsy: true })
                .isLength({ min: 3, max: 50 }).withMessage('company.validations.company_name_length').trim(),
            generalValidator
        ];
    }

    remove() {
        return [
            param('id')
                .notEmpty().isMongoId().withMessage('company.validations.company_id_invalid').trim(),
            generalValidator
        ];
    }

    manager() {
        return [
            param('id')
                .notEmpty().isMongoId().withMessage('company.validations.company_id_invalid').trim(),
            body('manager_id')
                .notEmpty().isMongoId().withMessage('company.validations.manager_id_invalid').trim(),
            generalValidator
        ]
    }

    deleteManager() {
        return [
            param('id')
                .notEmpty().isMongoId().withMessage('company.validations.company_id_invalid').trim(),
            body('manager_id')
                .notEmpty().isMongoId().withMessage('company.validations.manager_id_invalid').trim(),
            generalValidator
        ]
    }
}

export default new CompanyValidation();