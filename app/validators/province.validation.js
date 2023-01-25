import { body, param, query } from 'express-validator'
import generalValidator from '../helper/validator.js';

class ProvinceValidation {

    index() {
        return [
            query('page')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('province.validations.province_page_number').trim(),
            query('size')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('province.validations.province_size_number').trim(),
            generalValidator
        ];
    }
}

export default new ProvinceValidation();