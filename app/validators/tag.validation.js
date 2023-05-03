import { body, param, query } from 'express-validator'
import generalValidator from '../helper/validator.js';
class TagValidation {
    index() {
        return [
            query('page')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('tag.validations.tag_page_number').trim(),
            query('size')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('tag.validations.tag_page_number').trim(),
            generalValidator
        ];
    }

    create() {
        return [
            body('name').isLength({ min: 3, max: 100 }).withMessage('resume.validations.max_tag_length').trim(),
            generalValidator
        ];
    }


}

export default new TagValidation();