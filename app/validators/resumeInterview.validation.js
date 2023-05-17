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






}

export default new ResumeInterviewValidation();