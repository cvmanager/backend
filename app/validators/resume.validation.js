import { body, param, query } from 'express-validator';

import generalValidator from '../helper/validator.js';
import i18n from '../middlewares/lang.middleware.js';
import { mobileFormat } from '../helper/helper.js';
import { json } from 'express';
class ResumeValidation {
    index() {
        return [
            query('page')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('resume.validations.resume_page_number').trim(),
            query('size')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('resume.validations.resume_size_number').trim(),
            generalValidator
        ];
    }

    create() {
        return [
            body('position_id')
                .notEmpty()
                .withMessage('resume.validations.position_id_required')
                .isMongoId()
                .withMessage('resume.validations.position_id_invalid')
                .trim(),
            body('firstname')
                .notEmpty()
                .withMessage('resume.validations.firstname_required')
                .isLength({ min: 3, max: 50 })
                .withMessage('resume.validations.firstname_length')
                .trim(),
            body('lastname')
                .notEmpty()
                .withMessage('resume.validations.lastname_required')
                .isLength({ min: 3, max: 50 })
                .withMessage('resume.validations.lastname_length')
                .trim(),
            body('gender')
                .notEmpty()
                .withMessage('resume.validations.gender_required')
                .isIn(i18n.__("system.enums.gender"))
                .withMessage('resume.validations.gender_incorrect')
                .trim(),
            body('email')
                .notEmpty()
                .withMessage('resume.validations.email_required')
                .isEmail()
                .withMessage('resume.validations.email_invalid')
                .trim(),
            body('birth_year')
                .notEmpty()
                .withMessage('resume.validations.birth_year_required')
                .isNumeric()
                .withMessage('resume.validations.birth_year_numeric')
                .isLength({ min: 4, max: 4 })
                .withMessage('resume.validations.birth_year_length')
                .trim(),
            body('marital_status')
                .notEmpty()
                .withMessage('resume.validations.marital_status_required')
                .isIn(i18n.__("system.enums.marital_status"))
                .withMessage('resume.validations.marital_status_incorrect')
                .trim(),
            body('mobile')
                .notEmpty()
                .withMessage('resume.validations.mobile_required')
                .matches(mobileFormat)
                .withMessage('auth.validations.mobile_pattern')
                .trim(),
            body('residence_city')
                .notEmpty()
                .withMessage('resume.validations.residence_city_required')
                .isMongoId()
                .withMessage('resume.validations.residence_city_id_invalid')
                .trim(),
            body('work_city')
                .notEmpty()
                .withMessage('resume.validations.work_city_required')
                .isMongoId()
                .withMessage('resume.validations.work_city_id_invalid')
                .trim(),
            body('education')
                .notEmpty()
                .withMessage('resume.validations.education_required')
                .isIn(i18n.__('system.enums.education'))
                .withMessage('resume.validations.education_incorrect')
                .trim(),
            body('phone')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric()
                .withMessage('resume.validations.phone_numeric')
                .isLength({ min: 9, max: 12 })
                .withMessage('resume.validations.phone_length')
                .trim(),
            body('min_salary')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric()
                .withMessage('resume.validations.min_salary_numeric')
                .isInt({ min: 0, max: 1000000000 })
                .withMessage('resume.validations.min_salary_length')
                .trim(),
            body('max_salary')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric()
                .withMessage('resume.validations.max_salary_numeric')
                .isInt({ min: 0, max: 1000000000 })
                .withMessage('resume.validations.max_salary_length')
                .trim(),
            body('work_experience')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric()
                .withMessage('resume.validations.work_exp_numeric')
                .trim(),
            body('military_status')
                .optional({ nullable: true, checkFalsy: true })
                .isIn(i18n.__("system.enums.military_status"))
                .withMessage('resume.validations.military_status_incorrect')
                .trim(),
            generalValidator
        ];
    }

    update() {
        return [
            param('id')
                .notEmpty()
                .withMessage('resume.validations.resume_id_required')
                .isMongoId()
                .withMessage('resume.validations.resume_id_invalid')
                .trim(),
            body('firstname')
                .optional({ nullable: true, checkFalsy: true })
                .isLength({ min: 3, max: 50 })
                .withMessage('resume.validations.update_firstname_legth')
                .trim(),
            body('lastname')
                .optional({ nullable: true, checkFalsy: true })
                .isLength({ min: 3, max: 50 })
                .withMessage('resume.validations.update_lastname_legth')
                .trim(),
            body('gender')
                .optional({ nullable: true, checkFalsy: true })
                .isIn(i18n.__("system.enums.gender"))
                .withMessage('resume.validations.gender_incorrect')
                .trim(),
            body('email')
                .optional({ nullable: true, checkFalsy: true })
                .isEmail()
                .withMessage('resume.validations.email_invalid')
                .trim(),
            body('birth_year')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric()
                .withMessage('resume.validations.birth_year_numeric')
                .isLength({ min: 4, max: 4 })
                .withMessage('resume.validations.birth_year_length')
                .trim(),
            body('marital_status')
                .optional({ nullable: true, checkFalsy: true })
                .isIn(i18n.__("system.enums.marital_status"))
                .withMessage('resume.validations.marital_status_incorrect')
                .trim(),
            body('mobile')
                .optional({ nullable: true, checkFalsy: true })
                .matches(mobileFormat)
                .withMessage('auth.validations.mobile_pattern')
                .trim(),
            body('residence_city')
                .optional({ nullable: true, checkFalsy: true })
                .isMongoId()
                .withMessage('resume.validations.residence_city_id_invalid')
                .trim(),
            body('work_city')
                .optional({ nullable: true, checkFalsy: true })
                .isMongoId()
                .withMessage('resume.validations.work_city_id_invalid')
                .trim(),
            body('education')
                .optional({ nullable: true, checkFalsy: true })
                .isIn(i18n.__("system.enums.education"))
                .withMessage('resume.validations.education_incorrect')
                .trim(),
            body('phone')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric()
                .withMessage('resume.validations.phone_numeric')
                .isLength({ min: 9, max: 12 })
                .withMessage('resume.validations.phone_length')
                .trim(),
            body('min_salary')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric()
                .withMessage('resume.validations.min_salary_numeric')
                .isInt({ min: 0, max: 1000000000 })
                .withMessage('resume.validations.min_salary_length')
                .trim(),
            body('max_salary')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric()
                .withMessage('resume.validations.max_salary_numeric')
                .isInt({ min: 0, max: 1000000000 })
                .withMessage('resume.validations.max_salary_length')
                .trim(),
            body('work_experience')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric()
                .withMessage('resume.validations.work_exp_numeric')
                .trim(),
            body('military_status')
                .optional({ nullable: true, checkFalsy: true })
                .isIn(i18n.__("system.enums.military_status"))
                .withMessage('resume.validations.military_status_incorrect')
                .trim(),
            generalValidator
        ];
    }

    update_status() {
        return [
            param('id')
                .notEmpty()
                .withMessage('resume.validations.resume_id_required')
                .isMongoId()
                .withMessage('resume.validations.resume_id_invalid')
                .trim(),
            body('status')
                .notEmpty()
                .withMessage('resume.validations.status_required')
                .isIn(i18n.__("resume.enums.status"))
                .withMessage('resume.validations.status_required')
                .trim(),
            generalValidator
        ];
    }

    call_history() {
        return [
            param('id')
                .notEmpty()
                .withMessage('resume.validations.resume_id_required')
                .isMongoId()
                .withMessage('resume.validations.resume_id_invalid')
                .trim(),
            body('result')
                .notEmpty()
                .withMessage('resume.validations.result_required')
                .isIn(i18n.__('resume.enums.call_history_status'))
                .withMessage('resume.validations.result_incorrect')
                .trim(),
            body('calling_date')
                .notEmpty()
                .withMessage('resume.validations.calling_date_required')
                .isISO8601()
                .toDate()
                .withMessage('resume.validations.calling_date_must_be_date')
                .trim(),
            body('description')
                .optional({ nullable: true, checkFalsy: true })
                .isLength({ min: 0, max: 1000 })
                .withMessage('resume.validations.description_length')
                .trim(),
            body('recall_at')
                .if(body('result').isIn('recall', i18n.__('resume.enums.call_history_status')))
                .notEmpty()
                .withMessage('recall_at is required')
                .isISO8601()
                .toDate()
                .withMessage('recall_at must be date')
                .trim(),
            body('rating')
                .notEmpty()
                .withMessage('resume.validations.rating_is_required')
                .isNumeric()
                .withMessage('resume.validations.rating_numeric')
                .isInt({ min: 1, max: 5 })
                .withMessage('resume.validations.rating_number_not_correct')
                .trim(),
            generalValidator
        ];
    }

    remove() {
        return [
            param('id')
                .notEmpty()
                .withMessage('resume.validations.resume_id_required')
                .isMongoId()
                .withMessage('resume.validations.resume_id_invalid')
                .trim(),
            generalValidator
        ];
    }


    find() {
        return [
            param('id')
                .notEmpty()
                .withMessage('resume.validations.resume_id_required')
                .isMongoId()
                .withMessage('resume.validations.resume_id_invalid')
                .trim(),
            generalValidator
        ];
    }

    upload_file() {
        return [
            param('id')
                .notEmpty()
                .withMessage('resume.validation.resume_id_required')
                .isMongoId()
                .withMessage('resume.validation.resume_id_invalid')
                .trim(),
            body('file')
                .notEmpty()
                .withMessage('resume.validation.file_required')
                .trim(),
            generalValidator
        ];
    }

    comments() {
        return [
            param('id')
                .notEmpty()
                .withMessage('resume.validations.resume_id_required')
                .isMongoId()
                .withMessage('resume.validations.resume_id_invalid')
                .trim(),
            generalValidator
        ];
    }

    addComments() {
        return [
            param('id')
                .notEmpty()
                .withMessage('resume.validations.resume_id_required')
                .isMongoId()
                .withMessage('resume.validations.resume_id_invalid')
                .trim(),
            body('body')
                .isLength({ min: 5, max: 1000 })
                .withMessage('resume.validations.max_comment_length')
                .trim(),
            generalValidator
        ];
    }

}

export default new ResumeValidation();