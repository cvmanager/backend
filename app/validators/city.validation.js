import { param, body, query } from 'express-validator';

import generalValidator from '../helper/validator.js';
class CityValidation {
    index() {
        return [
            query('page')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('company.validations.company_page_number').trim(),
            query('size')
                .optional({ nullable: true, checkFalsy: true })
                .isNumeric().withMessage('company.validations.company_size_number').trim(),
            generalValidator
        ];
    }
    find() {
        return [
            param('id')
                .notEmpty()
                .withMessage('city.validations.city_id_required')
                .isMongoId()
                .withMessage('city.validations.city_id_invalid')
                .trim(),
            generalValidator
        ];
    }

}


export default new CityValidation()