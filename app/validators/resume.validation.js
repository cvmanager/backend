import { body, param } from 'express-validator';

import generalValidator from '../helper/validator.js';
import i18n from '../middlewares/lang.middleware.js';
import { mobileFormat } from '../helper/helper.js';

const create = [
    body('project_id')
        .notEmpty()
            .withMessage('resume.validation.project_id_required')
        .isMongoId()
            .withMessage('resume.validation.porject_id_invalid')
        .trim(),
    body('firstname')
        .notEmpty()
            .withMessage('resume.validation.firstname_required')
        .isLength({ min: 3, max: 50 })
            .withMessage('resume.validation.firstname_length')
        .trim(),
    body('lastname')
        .notEmpty()
            .withMessage('resume.validation.lastname_required')
        .isLength({ min: 3, max: 50 })
            .withMessage('resume.validation.lastname_length')
        .trim(),
    body('gender')
        .notEmpty()
            .withMessage('resume.validation.gender_required')
        .isIn(i18n.__("enums.gender"))
            .withMessage('resume.validation.gender_incorrect')
        .trim(),
    body('email')
        .notEmpty()
            .withMessage('resume.validation.email_required')
        .isEmail()
            .withMessage('resume.validation.email_invalid')
        .trim(),
    body('birth_year')
        .notEmpty()
            .withMessage('resume.validation.birth_year_required')
        .isLength({ min: 4, max: 4 })
            .withMessage('resume.validation.birth_year_length')
        .trim(),
    body('marital_status')
        .notEmpty()
            .withMessage('resume.validation.marital_status_required')
        .isIn(i18n.__("enums.marital_status"))
            .withMessage('resume.validation.marital_status_incorrect')
        .trim(),
    body('mobile')
        .notEmpty()
            .withMessage('resume.validation.mobile_required')
        .matches(mobileFormat) 
            .withMessage('auth.validation.mobile_pattern')
        .trim(),
    body('residence_city')
        .notEmpty()
            .withMessage('resume.validation.residence_city_required')
        .isLength({ min: 2, max: 50 })
            .withMessage('resume.validation.residence_city_length')
        .trim(),
    body('work_city')
        .notEmpty()
            .withMessage('resume.validation.work_city_required')
        .isLength({ min: 2, max: 50 })
            .withMessage('resume.validation.work_city_length')
        .trim(),
    body('education')
        .notEmpty() 
            .withMessage('resume.validation.education_required')
        .isIn(i18n.__('enums.education'))
            .withMessage('resume.validation.education_incorrect')
        .trim(),
    body('major')
        .notEmpty()
            .withMessage('resume.validation.major_required')
        .isLength({ min: 3, max: 20 })
            .withMessage('resume.validation.major_length')
        .trim(),
    body('phone')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('resume.validation.phone_numeric')
        .isLength({ min: 9, max: 12 }) 
            .withMessage('resume.validation.phone_length')
        .trim(),
    body('min_salary')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('resume.validation.min_salary_numeric')
        .isLength({ min: 0, max: 1000000000 })
            .withMessage('resume.validation.min_salary_length')
        .trim(),
    body('max_salary')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('resume.validation.max_salary_numeric')
        .isLength({ min: 0, max: 1000000000 })
            .withMessage('resume.validation.max_salary_length')
        .trim(),
    body('work_experience')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('resume.validation.work_exp_numeric')
        .trim(),
    body('military_status')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(i18n.__("enums.military_status"))
            .withMessage('resume.validation.military_status_incorrect')
        .trim(),
    generalValidator
];

const update = [
    param('id')
        .notEmpty()
            .withMessage('resume.validation.id_required')
        .isMongoId()
            .withMessage('resume.validation.id_invalid')
        .trim(),
    body('company_id')
        .optional({ nullable: true, checkFalsy: true })
        .isMongoId()
            .withMessage('resume.validation.company_invalid')
        .trim(),
    body('project_id')
        .optional({ nullable: true, checkFalsy: true })
        .isMongoId()
            .withMessage('resume.validation.porject_invalid')
        .trim(),
    body('firstname')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 3, max: 50 })
            .withMessage('resume.validation.update_firstname_legth')
        .trim(),
    body('lastname')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 3, max: 50 })
            .withMessage('resume.validation.update_lastname_legth')
        .trim(),
    body('gender')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(i18n.__("enums.gender"))
            .withMessage('resume.validation.gender_incorrect')
        .trim(),
    body('email')
        .optional({ nullable: true, checkFalsy: true })
        .isEmail()
            .withMessage('resume.validation.email_invalid')
        .trim(),
    body('birth_year')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 4, max: 4 })
            .withMessage('resume.validation.birth_year_length')
        .trim(),
    body('marital_status')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(i18n.__("marital_status"))
            .withMessage('resume.validation.marital_status_incorrect')
        .trim(),
    body('mobile')
        .optional({ nullable: true, checkFalsy: true })
        .matches(mobileFormat)
            .withMessage('auth.validation.mobile_pattern')
        .trim(),
    body('residence_city')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 2, max: 50 })
            .withMessage('resume.validation.residence_city_length')
        .trim(),
    body('work_city')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 2, max: 50 })
            .withMessage('resume.validation.work_city_length')
        .trim(),
    body('education')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(i18n.__("enums.education"))
            .withMessage('resume.validation.education_incorrect')
        .trim(),
    body('major')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 3, max: 20 })
            .withMessage('resume.validation.major_invalid')
        .trim(),
    body('phone')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('')
        .isLength({ min: 9, max: 12 })
            .withMessage('resume.validation.phone_length')
        .trim(),
    body('min_salary')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('resume.validation.min_salary_numeric')
        .isLength({ min: 0, max: 100000000 })
            .withMessage('resume.validation.min_salary_length')
        .trim(),
    body('max_salary')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('resume.validation.max_salary_numeric')
        .isLength({ min: 0, max: 100000000 })
            .withMessage('resume.validation.max_salary_length')
        .trim(),
    body('work_experience')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('resume.validation.work_exp_numeric')
        .trim(),
    body('military_status')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(i18n.__("enums.military_status"))
            .withMessage('resume.validation.military_status_incorrect')
        .trim(),
    generalValidator
];

const update_status = [
    param('id')
        .notEmpty()
            .withMessage('resume.validation.id_required')
        .isMongoId()
            .withMessage('resume.validation.id_invalid')
        .trim(),
    body('status')
        .notEmpty()
            .withMessage('resume.validation.status_required')
        .isIn(i18n.__("enums.resume_status"))
        .withMessage('resume.validation.status_required')
        .trim(),
    generalValidator
]

const remove = [
    param('id')
        .notEmpty()
            .withMessage('resume.validation.resume_id_required')
        .isMongoId()
            .withMessage('resume.validation.resume_id_invalid')
        .trim(),
    generalValidator
];


const find = [
    param('id')
        .notEmpty()
            .withMessage('resume.validation.resume_id_required')
        .isMongoId()
            .withMessage('resume.validation.resume_id_invalid')
        .trim(),
    generalValidator
];

export { create, update, update_status, remove, find }