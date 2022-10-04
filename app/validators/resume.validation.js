import { body, param } from 'express-validator';

import generalValidator from '../helper/validator.js';
import { mobileFormat } from '../helper/helper.js';

const create = [
    body('company_id')
        .notEmpty()
            .withMessage('resume.validator.company_require')
        .isMongoId()
            .withMessage('esume.validator.company_invalid')
        .trim(),
    body('project_id')
        .notEmpty()
            .withMessage('resume.validator.project_require')
        .isMongoId()
            .withMessage('resume.validator.porject_invalid')
        .trim(),
    body('firstname')
        .notEmpty()
            .withMessage('resume.validator.firstname_required')
        .isLength({ min: 3, max: 50 })
            .withMessage('resume.validator.firstname_length')
        .trim(),
    body('lastname')
        .notEmpty()
            .withMessage('resume.validator.lastname_required')
        .isLength({ min: 3, max: 50 })
            .withMessage('resume.validator.lastname_length')
        .trim(),
    body('gender')
        .notEmpty()
            .withMessage('resume.validator.gender_required')
        .isIn(['men', 'women'])
            .withMessage('resume.validator.gender_incorrect')
        .trim(),
    body('email')
        .notEmpty()
            .withMessage('resume.validator.email_required')
        .isEmail()
            .withMessage('resume.validator.email_invalid')
        .trim(),
    body('birth_year')
        .notEmpty()
            .withMessage('resume.validator.birth_year_required')
        .isLength({ min: 4, max: 4 })
            .withMessage('resume.validator.birth_year_length')
        .trim(),
    body('marital_status')
        .notEmpty()
            .withMessage('resume.validator.marital_status_required')
        .isIn(['single', 'married', 'isolated', 'unknow'])
            .withMessage('resume.validator.marital_status_incorrect')
        .trim(),
    body('mobile')
        .notEmpty()
            .withMessage('resume.validator.mobile_required')
        .matches(mobileFormat) 
            .withMessage('auth.validator.mobile_pattern')
        .trim(),
    body('residence_city')
        .notEmpty()
            .withMessage('resume.validator.residence_city_required')
        .isLength({ min: 2, max: 50 })
            .withMessage('resume.validator.residence_city_length')
        .trim(),
    body('work_city')
        .notEmpty()
            .withMessage('resume.validator.work_city_required')
        .isLength({ min: 2, max: 50 })
            .withMessage('resume.validator.work_city_length')
        .trim(),
    body('education')
        .notEmpty() 
            .withMessage('resume.validator.education_required')
        .isIn(['phd', 'diploma', 'associate_degree', 'bachelors_degree', 'masters'])
            .withMessage('resume.validator.education_incorrect')
        .trim(),
    body('major')
        .notEmpty()
            .withMessage('resume.validator.major_required')
        .isLength({ min: 3, max: 20 })
            .withMessage('resume.validator.major_length')
        .trim(),
    body('phone')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('resume.validator.phone_numeric')
        .isLength({ min: 9, max: 12 }) 
            .withMessage('resume.validator.phone_length')
        .trim(),
    body('min_salary')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('resume.validator.min_salary_numeric')
        .isLength({ min: 0, max: 1000000000 })
            .withMessage('resume.validator.min_salary_length')
        .trim(),
    body('max_salary')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('resume.validator.max_salary_numeric')
        .isLength({ min: 0, max: 1000000000 })
            .withMessage('resume.validator.max_salary_length')
        .trim(),
    body('work_experience')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('resume.validator.work_exp_numeric')
        .trim(),
    body('military_status')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['included', 'end', 'exemption-edu', 'exemption-spo'])
            .withMessage('resume.validator.military_status_incorrect')
        .trim(),
    generalValidator
];

const update = [
    param('id')
        .notEmpty()
            .withMessage('resume.validator.id_require')
        .isMongoId()
            .withMessage('resume.validator.id_invalid')
        .trim(),
    body('company_id')
        .optional({ nullable: true, checkFalsy: true })
        .isMongoId()
            .withMessage('resume.validator.company_invalid')
        .trim(),
    body('project_id')
        .optional({ nullable: true, checkFalsy: true })
        .isMongoId()
            .withMessage('resume.validator.porject_invalid')
        .trim(),
    body('firstname')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 3, max: 50 })
            .withMessage('resume.validator.update_firstname_legth')
        .trim(),
    body('lastname')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 3, max: 50 })
            .withMessage('resume.validator.update_lastname_legth')
        .trim(),
    body('gender')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['men', 'women'])
            .withMessage('resume.validator.gender_incorrect')
        .trim(),
    body('email')
        .optional({ nullable: true, checkFalsy: true })
        .isEmail()
            .withMessage('resume.validator.email_invalid')
        .trim(),
    body('birth_year')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 4, max: 4 })
            .withMessage('resume.validator.birth_year_length')
        .trim(),
    body('marital_status')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['single', 'married', 'isolated', 'unknow'])
            .withMessage('resume.validator.marital_status_incorrect')
        .trim(),
    body('mobile')
        .optional({ nullable: true, checkFalsy: true })
        .matches(mobileFormat)
            .withMessage('auth.validator.mobile_pattern')
        .trim(),
    body('residence_city')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 2, max: 50 })
            .withMessage('resume.validator.residence_city_length')
        .trim(),
    body('work_city')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 2, max: 50 })
            .withMessage('resume.validator.work_city_length')
        .trim(),
    body('education')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['phd', 'diploma', 'associate_degree', 'bachelors_degree', 'masters'])
            .withMessage('resume.validator.education_incorrect')
        .trim(),
    body('major')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 3, max: 20 })
            .withMessage('resume.validator.major_invalid')
        .trim(),
    body('phone')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('')
        .isLength({ min: 9, max: 12 })
            .withMessage('resume.validator.phone_length')
        .trim(),
    body('min_salary')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('resume.validator.min_salary_numeric')
        .isLength({ min: 0, max: 1000000000 })
            .withMessage('resume.validator.min_salary_length')
        .trim(),
    body('max_salary')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('resume.validator.max_salary_numeric')
        .isLength({ min: 0, max: 1000000000 })
            .withMessage('resume.validator.max_salary_length')
        .trim(),
    body('work_experience')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
            .withMessage('resume.validator.work_exp_numeric')
        .trim(),
    body('military_status')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['included', 'end', 'exemption-edu', 'exemption-spo'])
            .withMessage('resume.validator.military_status_incorrect')
        .trim(),
    generalValidator
];

const update_status = [
    param('id')
        .notEmpty()
            .withMessage('resume.validator.id_require')
        .isMongoId()
            .withMessage('resume.validator.id_invalid')
        .trim(),
    body('status')
        .notEmpty()
            .withMessage('resume.validator.status_require')
        .isIn([
            'pending',
            'call_review',
            'tech_review',
            'wait_reject',
            'rejected',
            'hired',
            'wait_hire',
        ])
        .withMessage('resume.validator.status_require')
        .trim(),
    generalValidator
]

const remove = [
    param('id')
        .notEmpty()
            .withMessage('resume.validator.id_require')
        .isMongoId()
            .withMessage('resume.validator.id_invalid')
        .trim(),
    generalValidator
];


const find = [
    param('id')
        .notEmpty()
            .withMessage('resume.validator.id_require')
        .isMongoId()
            .withMessage('resume.validator.id_invalid')
        .trim(),
    generalValidator
];

export { create, update, update_status, remove, find }