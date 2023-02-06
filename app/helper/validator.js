import { validationResult } from "express-validator";

import BadRequestError from "../exceptions/BadRequestError.js";

function generalValidator(req, res, next) {
    try {
        var errorValidation = validationResult(req);
        if (!errorValidation.isEmpty()) {
            let errors = {}
            for (let error of errorValidation.errors) {
                let translatedMsg = res.__(error.msg)

                // if field already exist push to array otherwise assign value
                if (translatedMsg == res.__('auth.validations.mobile_username_wrong')) {
                    errors['mobile'] = [translatedMsg]
                    continue;
                }
                
                if (errors[error.param]) {
                    errors[error.param].push(translatedMsg)
                } else {
                    errors[error.param] = [translatedMsg]
                }
            }

            throw new BadRequestError("system.errors.bad_request", [errors]);
        }
        next();
    } catch (err) {
        next(err)
    }
}

export default generalValidator