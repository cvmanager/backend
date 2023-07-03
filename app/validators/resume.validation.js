import { body, param, query } from 'express-validator';

import generalValidator from '../helper/validator.js';
import { getEnume, mobileFormat } from '../helper/helper.js';
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
                .withMessage('resume.validations.first_name_required')
                .isLength({ min: 3, max: 50 })
                .withMessage('resume.validations.first_name_length')
                .trim(),
            body('lastname')
                .notEmpty()
                .withMessage('resume.validations.last_name_required')
                .isLength({ min: 3, max: 50 })
                .withMessage('resume.validations.last_name_length')
                .trim(),
            body('gender')
                .notEmpty()
                .withMessage('resume.validations.gender_required')
                .isIn(getEnume("system","gender"))
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
                .isIn(getEnume("system","marital_status"))
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
            // body('work_city')
            //     .notEmpty()
            //     .withMessage('resume.validations.work_city_required')
            //     .isMongoId()
            //     .withMessage('resume.validations.work_city_id_invalid')
            //     .trim(),
            body('education')
                .notEmpty()
                .withMessage('resume.validations.education_required')
                .isIn(getEnume("system","education"))
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
                .if(body('gender').isIn('men', getEnume('system","gender')))
                .isIn(getEnume("system","military_status"))
                .withMessage('resume.validations.military_status_incorrect_for_men')
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
                .isIn(getEnume("system","gender"))
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
                .isIn(getEnume("system","marital_status"))
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
                .isIn(getEnume("system","education"))
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
                .isIn(getEnume("system","military_status"))
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
                .not().isIn(['hired', 'rejected', 'end_cooperation'])
                .withMessage('resume.errors.can_not_save_hired_rejected_status')
                .isIn(getEnume("resume","status"))
                .withMessage('resume.validations.status_required')
                .trim(),
            body('index')
                .notEmpty()
                .withMessage('resume.validations.index_required')
                .isNumeric()
                .withMessage('resume.validations.index_invalid')
                .trim(),
            generalValidator
        ];
    }

    call_history() {
        return [
            param('id').notEmpty().isMongoId().withMessage('resume.validations.resume_id_invalid').trim(),
            body('result')
                .notEmpty()
                .withMessage('resume.validations.result_required')
                .isIn(getEnume('resume','call_history_status'))
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
                .if(body('result').isIn('recall', getEnume('resume','call_history_status')))
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
            param('id').notEmpty().isMongoId().withMessage('resume.validations.resume_id_invalid').trim(),
            generalValidator
        ];
    }


    find() {
        return [
            param('id').notEmpty().isMongoId().withMessage('resume.validations.resume_id_invalid').trim(),
            generalValidator
        ];
    }

    upload_file() {
        return [
            param('id').notEmpty().isMongoId().withMessage('resume.validation.resume_id_invalid').trim(),
            body('file').notEmpty().withMessage('resume.validation.file_required').trim(),
            generalValidator
        ];
    }

    comments() {
        return [
            param('id').notEmpty().isMongoId().withMessage('resume.validations.resume_id_invalid').trim(),
            generalValidator
        ];
    }

    addComments() {
        return [
            param('id').notEmpty().isMongoId().withMessage('resume.validations.resume_id_invalid').trim(),
            body('body')
                .isLength({ min: 5, max: 1000 })
                .withMessage('resume.validations.max_comment_length')
                .trim(),
            generalValidator
        ];
    }

    setAssigner() {
        return [
            param('id').notEmpty().isMongoId().withMessage('resume.validations.resume_id_invalid').trim(),
            body('user_id').notEmpty().isMongoId().withMessage('resume.validation.contributor_id_invalid').trim(),
            generalValidator
        ];
    }

    unsetAssigner() {
        return [
            param('id').notEmpty().isMongoId().withMessage('resume.validations.resume_id_invalid').trim(),
            body('user_id').notEmpty().isMongoId().withMessage('resume.validation.contributor_id_invalid').trim(),
            generalValidator
        ];
    }

    reject() {
        return [
            param('id')
                .notEmpty()
                .withMessage('resume.validations.resume_id_required')
                .isMongoId()
                .withMessage('resume.validations.resume_id_invalid')
                .trim(),
            body('reject_reason')
                .isIn(getEnume("resume","reject_reason"))
                .withMessage('resume.validations.reject_reason_value_not_valid')
                .notEmpty()
                .withMessage('resume.validations.reject_reason')
                .trim(),
            body('reject_description')
                .optional({ nullable: true, checkFalsy: true })
                .isLength({ min: 0, max: 1000 })
                .withMessage('resume.validations.description_length')
                .trim(),
            generalValidator
        ];
    }

    avatar() {
        return [
            param('id')
                .notEmpty().isMongoId().withMessage('resume.validations.resume_id_invalid').trim(),
            generalValidator
        ];
    }

    set_tag() {
        return [
            param('id').notEmpty().isMongoId().withMessage('resume.validations.resume_id_invalid').trim(),
            body('tag_id').notEmpty().isMongoId().withMessage('resume.validations.resume_id_invalid').trim(),
            generalValidator
        ];
    }

    unset_tag() {
        return [
            param('id').notEmpty().isMongoId().withMessage('resume.validations.resume_id_invalid').trim(),
            body('tag_id').notEmpty().isMongoId().withMessage('tag.validations.tag_id_invalid').trim(),
            generalValidator
        ];
    }

    hired() {
        return [
            param('id')
                .notEmpty()
                .withMessage('resume.validations.resume_id_required')
                .isMongoId()
                .withMessage('resume.validations.resume_id_invalid')
                .trim(),
            body('hired_from_date')
                .notEmpty()
                .withMessage('resume.validations.hired_from_date_required')
                .isISO8601()
                .toDate()
                .withMessage('resume.validations.hired_from_date_must_be_date')
                .trim(),
            body('income')
                .notEmpty()
                .withMessage('resume.validations.income_required')
                .isNumeric()
                .withMessage('resume.validations.income_is_number')
                .trim(),
            generalValidator
        ];
    }

    end_cooperation() {
        return [
            param('id')
                .notEmpty()
                .withMessage('resume.validations.resume_id_required')
                .isMongoId()
                .withMessage('resume.validations.resume_id_invalid')
                .trim(),
            body('end_cooperation_date')
                .notEmpty()
                .withMessage('resume.validations.end_cooperation_date_required')
                .isISO8601()
                .toDate()
                .withMessage('resume.validations.end_cooperation_date_must_be_date')
                .trim(),
            body('end_cooperation_reason')
                .notEmpty()
                .withMessage('resume.validations.end_cooperation_reason_required')
                .isIn(getEnume("resume","end_cooperation_reason"))
                .withMessage('resume.validations.end_cooperation_reason_not_valid')
                .trim(),
            body('end_cooperation_description')
                .optional({ nullable: true, checkFalsy: true })
                .isLength({ max: 1000 })
                .withMessage('resume.validations.end_cooperation_description_length')
                .trim(),
            generalValidator
        ];
    }

    set_skill() {
        return [
            param('id').notEmpty().isMongoId().withMessage('resume.validations.resume_id_invalid').trim(),
            body('skill_id').notEmpty().isMongoId().withMessage('resume.validations.skill_id_invalid').trim(),
            generalValidator
        ];
    }

    unset_skill() {
        return [
            param('id').notEmpty().isMongoId().withMessage('resume.validations.resume_id_invalid').trim(),
            body('skill_id').notEmpty().isMongoId().withMessage('tag.validations.skill_id_invalid').trim(),
            generalValidator
        ];
    }

    create_interview() {
        return [
            param('id').notEmpty().isMongoId().withMessage('interview.validations.resume_id_invalid').trim(),
            body('event_time').notEmpty().isISO8601()
                .toDate()
                .withMessage('interview.validations.event_time_invalid').trim(),
            body('event_type').notEmpty().withMessage('interview.validations.event_type_required')
                .isIn(getEnume("interview","event_type"))
                .withMessage('interview.validations.event_type_incorrect')
                .trim(),
            body('type')
                .notEmpty()
                .withMessage('interview.validations.type_required')
                .isIn(getEnume("interview","type"))
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
                .withMessage('interview.validations.contribution_array'),
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

    update_interview() {
        return [
            param('id')
                .notEmpty()
                .withMessage('interview.validations.resume_id_required')
                .isMongoId()
                .withMessage('interview.validations.resume_id_invalid')
                .trim(),
            body('interview_id')
                .notEmpty()
                .isMongoId()
                .withMessage('company.validations.company_id_invalid')
                .trim(),
            body('event_time')
                .optional({ nullable: true, checkFalsy: true })
                .isISO8601()
                .toDate()
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
                .isIn(getEnume("interview","event_type"))
                .withMessage('interview.validations.event_type_incorrect')
                .trim(),
            body('type')
                .optional({ nullable: true, checkFalsy: true })
                .isIn(getEnume("interview","type"))
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
                .withMessage('interview.validations.contribution_array'),
            body('status')
                .notEmpty()
                .isIn(getEnume("interview","status"))
                .withMessage('interview.validations.status_incorrect')
                .trim(),
            body('result')
                .notEmpty()
                .isIn(getEnume("interview","result"))
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

    remove_interview() {
        return [
            param('id').notEmpty().isMongoId().withMessage('interview.validations.resume_id_invalid').trim(),
            body('interview_id').notEmpty().isMongoId().withMessage('interview.validations.interview_id_invalid').trim(),
            generalValidator
        ];
    }



    get_interviews() {
        return [
            param('id').notEmpty().isMongoId().withMessage('interview.validations.resume_id_invalid').trim(),
            body('interview_id').notEmpty().isMongoId().withMessage('interview.validations.interview_id_invalid').trim(),
            generalValidator
        ];
    }

}

export default new ResumeValidation();