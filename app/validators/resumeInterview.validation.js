import { body, param, query } from 'express-validator';

import generalValidator from '../helper/validator.js';
import i18n from '../middlewares/lang.middleware.js';



class ResumeInterviewValidation {

    index() {
        return [
            param('id')
                .notEmpty()
                .withMessage('interview.validations.resume_id_required')
                .isMongoId()
                .withMessage('interview.validations.resume_id_invalid')
                .trim(),
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
            param('id').notEmpty().isMongoId().withMessage('interview.validations.resume_id_invalid').trim(),
            body('event_time').notEmpty().isDate().withMessage('interview.validations.event_time_invalid').trim(),
            body('event_time').toDate().custom((eventTime, { req }) => {
                if (eventTime) {
                    let nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
                    if (
                        Date.now() < eventTime.getTime() &&
                        eventTime.getTime() < nextYear.getTime()
                    ) {
                        throw new Error('interview.validations.event_time_invalid');
                    }
                }
                return true
            }),
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
            body('rating')
                .notEmpty()
                .withMessage('interview.validations.rating_is_required')
                .isNumeric()
                .withMessage('interview.validations.rating_numeric')
                .isInt({ min: 1, max: 5 })
                .withMessage('interview.validations.rating_number_not_correct')
                .trim(),
            generalValidator
        ];
    }

    update() {
        return [
            param('id')
                .notEmpty()
                .withMessage('interview.validations.resume_id_required')
                .isMongoId()
                .withMessage('interview.validations.resume_id_invalid')
                .trim(),
            param('interview_id')
                .notEmpty()
                .isMongoId()
                .withMessage('company.validations.company_id_invalid')
                .trim(),
            body('event_time')
                .optional({ nullable: true, checkFalsy: true })
                .isDate()
                .withMessage('interview.validations.event_time_invalid')
                .trim(),
            body('event_time').toDate().custom((eventTime, { req }) => {
                if (eventTime) {
                    let nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
                    if (
                        Date.now() < eventTime.getTime() &&
                        eventTime.getTime() < nextYear.getTime()
                    ) {
                        throw new Error('interview.validations.event_time_invalid');
                    }
                }
                return true
            }),
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
                .notEmpty()
                .isIn(i18n.__("interview.enums.status"))
                .withMessage('interview.validations.status_incorrect')
                .trim(),
            body('result')
                .notEmpty()
                .isIn(i18n.__("interview.enums.result"))
                .withMessage('interview.validations.result_incorrect')
                .trim(),
            body('rating')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric()
                .withMessage('interview.validations.rating_numeric')
                .isInt({ min: 1, max: 5 })
                .withMessage('interview.validations.rating_number_not_correct')
                .trim(),
            generalValidator
        ];

    }

    find() {
        return [
            param('id').notEmpty().isMongoId().withMessage('interview.validations.resume_id_invalid').trim(),
            param('interview_id').notEmpty().isMongoId().withMessage('interview.validations.interview_id_invalid').trim(),
            generalValidator
        ];
    }

    remove() {
        return [
            param('id').notEmpty().isMongoId().withMessage('interview.validations.resume_id_invalid').trim(),
            param('interview_id').notEmpty().isMongoId().withMessage('interview.validations.interview_id_invalid').trim(),
            generalValidator
        ];
    }

}

export default new ResumeInterviewValidation();