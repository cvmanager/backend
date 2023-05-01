import { body} from 'express-validator';
import generalValidator from '../helper/validator.js';
class TagValidation {
    create() {
        return [
            body('name').isLength({ min: 3, max: 100 }).withMessage('resume.validations.max_tag_length').trim(),
            generalValidator
        ];
    }


}

export default new TagValidation();