import { body, param, query } from 'express-validator'
import generalValidator from '../helper/validator.js';

class ProvinceValidation {

    cities() {
        return [
            param('id').notEmpty().isMongoId().withMessage('province.validations.province_id_invalid').trim(),
            generalValidator
        ];
    }
}

export default new ProvinceValidation();