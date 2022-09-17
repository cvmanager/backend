const { body, validationResult } = require('express-validator');
const BadRequestError = require('../exceptions/BadRequestError');

exports.resume_create = [
    body('project_id')
        .notEmpty().withMessage('project id is require')
        .isMongoId().withMessage('project id invalid')
        .trim(),
    body('firstname')
        .notEmpty().withMessage('firstname is require')
        .isLength({ min: 3, max: 50 }).withMessage('firstname should not be empty, should be more than one and less than 3 character')
        .trim(),
    body('lastname')
        .notEmpty().withMessage('lastname is require')
        .isLength({ min: 3, max: 50 }).withMessage('lastname should not be empty, should be more than one and less than 3 character')
        .trim(),
    body('gender')
        .notEmpty().withMessage('gender is require')
        .isIn('men', 'women').withMessage('gender value invalid!')
        .trim(),
    body('email')
        .notEmpty().withMeage('gender is require')
        .isEmail().withMessage('email is not valid')
        .trim(),
    body('birth_year')
        .notEmpty().withMeage('birth_year is require')
        .isLength({ min: 4, max: 4 }).withMeage('birth year should not be empty, should be more than one and less than 4 character')
        .trim(),
    body('marital_status')
        .notEmpty().withMessage('marital status is require')
        .isIn('single', 'married', 'isolated', 'unknow').withMessage('marital status  value invalid!')
        .trim(),
    body('mobile')
        .notEmpty().withMeage('mobile is require')
        .isMobilePhone().withMeage('mobile number invalid')
        .trim(),
    body('residence_city')
        .notEmpty().withMeage('residence_city is require')
        .isLength({ min: 2, max: 50 }).withMessage('residence_city  should not be empty, should be more than one and less than 2 character')
        .trim(),
    body('work_city')
        .notEmpty().withMeage('work_city is require')
        .isLength({ min: 2, max: 50 }).withMessage('work_city  should not be empty, should be more than one and less than 2 character')
        .trim(),
    body('education')
        .notEmpty().withMeage('education is require')
        .isIn('phd', 'diploma', 'associate-degree', 'bachelors-degree', 'masters').withMessage('education   value invalid!')
        .trim(),
    body('major')
        .notEmpty().withMeage('major is require')
        .isLength({ min: 3, max: 20 }).withMessage('major is not valid')
        .trim(),
    body('phone')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric().withMessage('phone only is number!')
        .isLength({ min: 9, max: 12 }).withMessage('phone 9-12!')
        .trim(),
    body('min_salary')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric().withMessage('min_salary only is number!')
        .isLength({ min: 0, max: 1000000000 }).withMessage('phone 9-12!')
        .trim(),
    body('max_salary')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric().withMessage('max_salary only is number!')
        .isLength({ min: 0, max: 1000000000 }).withMessage('phone 9-12!')
        .trim(),
    body('work_experience')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric().withMessage('max_salary only is number!')
        .isLength({ min: 4, max: 4 }).withMeage('max_salary  should not be empty, should be more than one and less than 4 character')
        .trim(),
    body('military_status')
        .optional({ nullable: true, checkFalsy: true })
        .isIn('included', 'end', 'exemption-edu', 'exemption-spo').withMessage('military_status   value invalid!')
        .trim(),

    function (req, res, next) {
        try {
            var errorValidation = validationResult(req);
            if (!errorValidation.isEmpty()) {
                let validationErr = errorValidation.errors.map(item => item.msg);
                throw new BadRequestError("BadRequest", validationErr);
            }
            next();
        } catch (err) {
            next(err)
        }
    }
];