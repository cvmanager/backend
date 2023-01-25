import { body, param, query } from 'express-validator';

import generalValidator from '../helper/validator.js';
import i18n from '../middlewares/lang.middleware.js';



class InterviewValidation {

    index() {
        return [
            query('page')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('interview.validations.interview_page_number').trim(),
            query('size')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('interview.validations.interview_size_number').trim(),
            generalValidator
        ];
    }

    create() {
        return [
            body('resume_id')
                .notEmpty()
                .withMessage('interview.validations.resume_id_required')
                .isMongoId()
                .withMessage('interview.validations.resume_id_invalid')
                .trim(),
            body('event_time')
                .notEmpty()
                .withMessage('interview.validations.event_time_required')
                .isDate()
                .withMessage('interview.validations.event_time_invalid')
                .trim(),
            body('event_type')
                .notEmpty()
                .withMessage('interview.validations.event_type_required')
                .isIn(i18n.__("interview.enums.event_type"))
                .withMessage('interview.validations.event_type_incorrect')
                .trim(),
            body('type')
                .notEmpty()
                .withMessage('interview.validations.type_required')
                .isIn(i18n.__("interview.enums.type"))
                .withMessage('interview.validations.type_incorrect')
                .trim(),
            body('description')
                .optional({ nullable: true, checkFalsy: true })
                .isLength({ min: 2, max: 512 })
                .withMessage('interview.validations.description_length')
                .trim(),
            body('contribution')
                .optional({ nullable: true, checkFalsy: true })
                .isArray()
                .withMessage('interview.validations.contribution_array')
                .trim(),
            generalValidator
        ];
    }

    update() {
        return [
            param('id')
                .notEmpty()
                .isMongoId()
                .withMessage('company.validations.company_id_invalid')
                .trim(),
            body('event_time')
                .optional({ nullable: true, checkFalsy: true })
                .isDate()
                .withMessage('interview.validations.event_time_invalid')
                .trim(),
            body('event_type')
                .optional({ nullable: true, checkFalsy: true })
                .isIn(i18n.__("interview.enums.event_type"))
                .withMessage('interview.validations.event_type_incorrect')
                .trim(),
            body('type')
                .optional({ nullable: true, checkFalsy: true })
                .isIn(i18n.__("interview.enums.type"))
                .withMessage('interview.validations.type_incorrect')
                .trim(),
            body('description')
                .optional({ nullable: true, checkFalsy: true })
                .isLength({ min: 2, max: 512 })
                .withMessage('interview.validations.description_length')
                .trim(),
            body('contribution')
                .optional({ nullable: true, checkFalsy: true })
                .isArray()
                .withMessage('interview.validations.contribution_array')
                .trim(),
            body('status')
                .optional({ nullable: true, checkFalsy: true })
                .isIn(i18n.__("interview.enums.status"))
                .withMessage('interview.validations.status_incorrect')
                .trim(),
            body('result')
                .optional({ nullable: true, checkFalsy: true })
                .isIn(i18n.__("interview.enums.result"))
                .withMessage('interview.validations.result_incorrect')
                .trim(),
            generalValidator
        ];

    }

    find() {
        return [
            param('id')
                .notEmpty()
                .withMessage('interview.validations.interview_id_required')
                .isMongoId()
                .withMessage('interview.validations.interview_id_invalid')
                .trim(),
            generalValidator
        ];
    }

    remove() {
        return [
            param('id')
                .notEmpty()
                .withMessage('interview.validations.interview_id_required')
                .isMongoId()
                .withMessage('interview.validations.interview_id_invalid')
                .trim(),
            generalValidator
        ];
    }

}

export default new InterviewValidation();